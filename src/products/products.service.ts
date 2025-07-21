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
    const product = this.dbService.productRepo.create(
      Object.assign({}, createProductDto, { imageUrl }),
    );
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
