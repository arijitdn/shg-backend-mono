import { DbService } from '@app/common/db/db.service';
import { Injectable } from '@nestjs/common';
import { In, MoreThan } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private dbService: DbService) {}

  async getShgStats(VoId?: string, clfId?: string) {
    const totalSHGs = await this.dbService.shgRepo.count();
    const totalVOs = await this.dbService.voRepo.count();
    const totalCLFs = await this.dbService.clfRepo.count();

    const totalShgByVo = VoId
      ? await this.dbService.shgRepo.count({
          where: { voId: VoId },
        })
      : undefined;
    const totalVoByClf = clfId
      ? await this.dbService.voRepo.count({
          where: { clfId },
        })
      : undefined;
    const totalShgByClf = clfId
      ? await this.dbService.shgRepo.count({
          where: { clfId },
        })
      : undefined;

    return {
      totalSHGs,
      totalVOs,
      totalCLFs,
      totalShgByVo,
      totalVoByClf,
      totalShgByClf,
    };
  }

  async getProductStats(shgId?: string, voId?: string, clfId?: string) {
    const totalProducts = await this.dbService.productRepo.count();
    const byShg = shgId
      ? await this.dbService.productRepo.count({ where: { shgId } })
      : undefined;

    let byVo: number | undefined;
    let byClf: number | undefined;

    if (voId || clfId) {
      const shgWhere: any = {};
      if (voId) shgWhere.voId = voId;
      if (clfId) shgWhere.clfId = clfId;

      const shgs = await this.dbService.shgRepo.find({
        where: shgWhere,
        select: ['id'],
      });

      const shgIds = shgs.map((shg) => shg.id);

      if (voId && shgIds.length > 0) {
        byVo = await this.dbService.productRepo.count({
          where: {
            shgId: In(shgIds),
          },
        });
      }
      if (clfId && shgIds.length > 0) {
        byClf = await this.dbService.productRepo.count({
          where: {
            shgId: In(shgIds),
          },
        });
      }
    }

    return {
      totalProducts,
      byShg,
      byVo,
      byClf,
    };
  }
  async getOrderStats(
    shgId?: string,
    voId?: string,
    clfId?: string,
    userId?: string,
    type?: string,
    deliveryType?: string,
  ) {
    const where: any = {};

    if (shgId) where.trlmId = shgId;
    if (voId) where.voId = voId;
    if (clfId) where.clfId = clfId;
    if (userId) where.customerId = userId;
    if (type === 'single') where.quantity = 1;
    if (type === 'bulk') where.quantity = MoreThan(1);
    if (deliveryType) where['deliveryAddress.addressType'] = deliveryType;

    const totalOrders = await this.dbService.orderRepo.count();
    const filteredOrders = await this.dbService.orderRepo.count({ where });

    return {
      totalOrders,
      filteredOrders,
    };
  }

  async getAdminStats(post?: string) {
    const totalEmployees = await this.dbService.trlmRepo.count();

    const totalPosts = await this.dbService.trlmRepo
      .createQueryBuilder('admin')
      .select('admin.post')
      .distinct(true)
      .getCount();

    const employeeByPost = await this.dbService.trlmRepo
      .createQueryBuilder('trlm')
      .select('trlm.post', 'post')
      .addSelect('COUNT(*)', 'count')
      .groupBy('trlm.post');

    return {
      totalEmployees,
      totalPosts,
      employeeByPost,
    };
  }
}
