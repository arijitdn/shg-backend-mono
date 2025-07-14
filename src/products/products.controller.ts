import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // VO dashboard products
  @Get('vo/list')
  //@Roles(UserRole.VO)
  getProductsForVO() {
    return this.productsService.findProductsForVO();
  }

  // CLF dashboard products
  @Get('clf/list')
  //@Roles(UserRole.CLF)
  getProductsForCLF() {
    return this.productsService.findProductsForCLF();
  }

  // VO recommends/rejects product
  @Patch(':id/vo-recommendation')
  //@Roles(UserRole.VO)
  recommendProduct(
    @Param('id') id: string,
    @Body() body: { recommend: boolean },
  ) {
    return this.productsService.recommendByVO(id, body.recommend);
  }

  // CLF approves/rejects product
  @Patch(':id/clf-approval')
  //@Roles(UserRole.CLF)
  approveProduct(@Param('id') id: string, @Body() body: { approve: boolean }) {
    return this.productsService.approveByCLF(id, body.approve);
  }
}
