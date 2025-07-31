import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/org-auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/org-auth/guards/roles-guard';
import { Roles } from 'src/org-auth/decorators/roles.decorator';
import { UserRole } from '@app/db/enums/user-role.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  //@ApiBody({ type: CreateProductDto })
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /^image\/.*/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /jpeg|jpg/ }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, image);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('vo/list')
  @Roles(UserRole.VO)
  @ApiOperation({ summary: 'Get products for VO role' })
  getProductsForVO() {
    return this.productsService.findProductsForVO();
  }

  @Get('clf/list')
  @Roles(UserRole.CLF)
  @ApiOperation({ summary: 'Get products for CLF role' })
  getProductsForCLF() {
    return this.productsService.findProductsForCLF();
  }

  @Patch('recommend/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VO)
  @ApiOperation({ summary: 'Recommend or reject a product by VO' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  recommendProduct(
    @Param('id') id: string,
    @Body()
    body: { recommend: boolean; remarks?: string; recommendedBy: string },
  ) {
    return this.productsService.recommendByVO(
      id,
      body.recommend,
      body.remarks,
      body.recommendedBy,
    );
  }

  @Patch('approve/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLF)
  @ApiOperation({ summary: 'Approve or reject a product by CLF' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  approveProduct(
    @Param('id') id: string,
    @Body() body: { approve: boolean; remarks?: string; approvedBy?: string },
  ) {
    return this.productsService.approveByCLF(
      id,
      body.approve,
      body.remarks,
      body.approvedBy,
    );
  }

  @Patch('reject/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VO, UserRole.CLF)
  @ApiOperation({ summary: 'Reject a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  rejectProduct(
    @Param('id') id: string,
    @Body() body: { reject: boolean; rejectedBy: string; remarks?: string },
  ) {
    return this.productsService.reject(
      id,
      body.reject,
      body.rejectedBy,
      body.remarks,
    );
  }

  @Patch('reapply/:id')
  @ApiOperation({ summary: 'Reapply a rejected product' })
  @UseInterceptors(FileInterceptor('image'))
  reapplyProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /jpeg|jpg/ }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    return this.productsService.reapplyForReview(id, updateProductDto, image);
  }
}
