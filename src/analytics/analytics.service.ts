import { DbService } from '@app/common/db/db.service';
import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private dbService: DbService) {}

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
}
