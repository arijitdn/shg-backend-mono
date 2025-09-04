import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { productCategory } from '@app/db/enums/product-category.enum';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  @Get()
  @ApiOperation({ summary: 'Get all product categories' })
  getCategories() {
    // Convert enum to array of objects with proper formatting
    const categories = Object.values(productCategory).map((category) => ({
      id: category,
      name: this.formatCategoryName(category),
      slug: category,
    }));

    return {
      success: true,
      data: categories,
    };
  }

  private formatCategoryName(category: string): string {
    return category
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
