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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('vo/list')
  //@Roles(UserRole.VO)
  @ApiOperation({ summary: 'Get products for VO role' })
  @ApiResponse({ status: 200, description: 'List of products for VO users' })
  getProductsForVO() {
    return this.productsService.findProductsForVO();
  }

  @Get('clf/list')
  //@Roles(UserRole.CLF)
  @ApiOperation({ summary: 'Get products for CLF role' })
  @ApiResponse({ status: 200, description: 'List of products for CLF users' })
  getProductsForCLF() {
    return this.productsService.findProductsForCLF();
  }

  @Patch(':id/vo-recommendation')
  //@Roles(UserRole.VO)
  @ApiOperation({ summary: 'Recommend or reject a product by VO' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recommend: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'VO recommendation updated' })
  recommendProduct(
    @Param('id') id: string,
    @Body() body: { recommend: boolean },
  ) {
    return this.productsService.recommendByVO(id, body.recommend);
  }

  @Patch(':id/clf-approval')
  @ApiOperation({ summary: 'Approve or reject a product by CLF' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        approve: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'CLF approval updated' })
  //@Roles(UserRole.CLF)
  approveProduct(@Param('id') id: string, @Body() body: { approve: boolean }) {
    return this.productsService.approveByCLF(id, body.approve);
  }
}
