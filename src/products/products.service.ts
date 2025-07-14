import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DbService } from '@app/common/db/db.service';
import { ProductEntity } from '@app/common/db/entities';
import { productType } from '@app/common/db/enums/product-type.enum';
import { ProductStatus } from '@app/common/db/enums/product-status.enum';

@Injectable()
export class ProductsService {
  constructor(private dbService: DbService) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = this.dbService.productRepo.create(createProductDto);
    return await this.dbService.productRepo.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.dbService.productRepo.find();
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.dbService.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return await product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);
    const updated = Object.assign(product, updateProductDto);
    return await this.dbService.productRepo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.dbService.productRepo.remove(product);
  }

  // Optional: Find by SHG or User
  async findByShgId(shgId: string): Promise<ProductEntity[]> {
    return await this.dbService.productRepo.find({ where: { shgId } });
  }

  async findByUserId(userId: string): Promise<ProductEntity[]> {
    return await this.dbService.productRepo.find({ where: { userId } });
  }

  // VO Recommendation
  async recommendByVO(id: string, recommend: boolean): Promise<ProductEntity> {
    const product = await this.findOne(id);

    if (product.type !== productType.SINGLE) {
      throw new BadRequestException(
        'Only SINGLE type products can be recommended by VO',
      );
    }

    product.isRecommended = recommend;

    product.status = recommend
      ? ProductStatus.RECOMMENDED
      : ProductStatus.REJECTED;
    return this.dbService.productRepo.save(product);
  }

  // CLF Approval
  async approveByCLF(id: string, approve: boolean): Promise<ProductEntity> {
    const product = await this.findOne(id);

    // Check if approval is valid based on type and recommendation
    if (product.type === productType.SINGLE && !product.isRecommended) {
      throw new BadRequestException(
        'Product must be recommended by VO before CLF approval',
      );
    }

    product.isApproved = approve;
    product.verificationDate = new Date();

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
}
