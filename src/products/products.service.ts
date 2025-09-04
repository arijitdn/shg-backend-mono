import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DbService } from '@app/db/db.service';
import { ProductEntity } from '@app/db/entities';
import { productType } from '@app/db/enums/product-type.enum';
import { ProductStatus } from '@app/db/enums/product-status.enum';
import { StorageService } from '@app/storage';
import { normalizePrice } from '../utils/price.utils';

@Injectable()
export class ProductsService {
  constructor(
    private dbService: DbService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    image?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined = undefined;
    if (image) {
      imageUrl = await this.storageService.uploadFile(image);
    }

    // Ensure price is stored in paise
    const normalizedPrice = normalizePrice(createProductDto.price);

    const product = this.dbService.productRepo.create(
      Object.assign({}, createProductDto, {
        imageUrl,
        price: normalizedPrice,
      }),
    );
    return await this.dbService.productRepo.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.dbService.productRepo.find();

    const productsWithShgNameAndUserName = products.map(async (product) => {
      let shgName = 'N/A';
      let userName = 'N/A';
      let voName = 'N/A';
      let clfName = 'N/A';

      if (product.shgId) {
        const shg = await this.dbService.shgRepo.findOne({
          where: { groupId: product.shgId },
        });
        if (shg) {
          shgName = shg.name;
          if (shg.voId) {
            const vo = await this.dbService.voRepo.findOne({
              where: { groupId: shg.voId },
            });
            if (vo) {
              voName = vo.name;
            }
          }

          if (shg.clfId) {
            const clf = await this.dbService.clfRepo.findOne({
              where: { groupId: shg.clfId },
            });
            if (clf) {
              clfName = clf.name;
            }
          }
        }
      }

      if (product.type === productType.SINGLE) {
        if (product.userId) {
          const user = await this.dbService.userRepo.findOne({
            where: { userId: product.userId },
          });
          if (user) {
            userName = user.name;
          }
        }
      }

      return {
        ...product,
        shgName,
        userName,
        voName,
        clfName,
      };
    });

    return Promise.all(productsWithShgNameAndUserName);
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.dbService.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    image?: Express.Multer.File,
  ) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    if (image) {
      if (product.imageUrl)
        await this.storageService.deleteFile(product.imageUrl);
      product.imageUrl = await this.storageService.uploadFile(image);
    }

    // Ensure price is stored in paise if being updated
    if (updateProductDto.price !== undefined) {
      updateProductDto.price = normalizePrice(updateProductDto.price);
    }

    const updated = Object.assign(product, updateProductDto);
    const saved = await this.dbService.productRepo.save(updated);
    return saved;
  }

  async remove(id: string): Promise<ProductEntity | null> {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');
    if (product.imageUrl) {
      await this.storageService.deleteFile(product.imageUrl);
    }
    const saved = await this.dbService.productRepo.remove(product);
    return saved;
  }

  async findProductByShgId(shgId: string): Promise<ProductEntity[]> {
    return await this.dbService.productRepo.find({ where: { shgId } });
  }

  async findProductByUserId(userId: string): Promise<ProductEntity[]> {
    return await this.dbService.productRepo.find({ where: { userId } });
  }

  async recommendByVO(
    id: string,
    recommend: boolean,
    remarks?: string,
    recommendedBy?: string,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);

    if (product.type !== productType.SINGLE) {
      throw new BadRequestException(
        'Only Individual products can be recommended by VO',
      );
    }

    product.isRecommended = recommend;
    product.recommendationDate = new Date();

    if (recommendedBy !== undefined) {
      product.recommendedBy = recommendedBy;
    }

    if (remarks) product.remarks = remarks;

    product.status = recommend
      ? ProductStatus.RECOMMENDED
      : ProductStatus.REJECTED;

    return this.dbService.productRepo.save(product);
  }

  async approveByCLF(
    id: string,
    approve: boolean,
    remarks?: string,
    approvedBy?: string,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);

    // Check if approval is valid based on type and recommendation
    if (product.type === productType.SINGLE && !product.isRecommended) {
      throw new BadRequestException(
        'Product must be recommended by VO before CLF approval',
      );
    }

    product.isApproved = approve;
    product.isRecommended = false;
    product.approvalDate = new Date();

    if (approvedBy !== undefined) {
      product.approvedBy = approvedBy;
    }

    if (remarks) product.remarks = remarks;

    product.status = approve ? ProductStatus.APPROVED : ProductStatus.REJECTED;
    return this.dbService.productRepo.save(product);
  }

  // VO Dashboard
  async findProductsForVO(): Promise<ProductEntity[]> {
    return this.dbService.productRepo.find({
      where: { type: productType.SINGLE },
    });
  }

  // CLF Dashboard
  async findProductsForCLF(): Promise<ProductEntity[]> {
    return this.dbService.productRepo.find({
      where: [
        { type: productType.NFC },
        { type: productType.SINGLE, isRecommended: true },
      ],
    });
  }

  async reject(
    id: string,
    reject: boolean,
    rejectedBy: string,
    remarks?: string,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product not found');

    product.isRejected = reject;
    product.isRecommended = false;
    product.isApproved = false;
    product.rejectionDate = new Date();
    product.rejectedBy = rejectedBy;

    if (remarks) product.remarks = remarks;

    product.status = reject ? ProductStatus.REJECTED : ProductStatus.PENDING;

    return this.dbService.productRepo.save(product);
  }

  async reapplyForReview(
    id: string,
    updateProductDto: UpdateProductDto,
    image?: Express.Multer.File,
  ) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('Product is not found');

    if (image) {
      if (product.imageUrl)
        await this.storageService.deleteFile(product.imageUrl);
      product.imageUrl = await this.storageService.uploadFile(image);
    }

    product.status = ProductStatus.PENDING;
    product.isRejected = false;
    product.isRecommended = false;
    product.remarks = '';

    const updated = Object.assign(product, updateProductDto);
    const saved = await this.dbService.productRepo.save(updated);
    return saved;
  }
}
