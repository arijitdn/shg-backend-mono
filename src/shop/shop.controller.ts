import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('cart/add')
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.shopService.addToCart(addToCartDto);
  }

  @Get('cart/get/:userId')
  @ApiOperation({ summary: 'Get user cart' })
  getCart(@Param('userId') userId: string) {
    return this.shopService.getCart(userId);
  }

  @Put('cart/update-cart')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.shopService.updateCartItem(updateCartDto);
  }

  @Delete('cart/:userId/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.shopService.removeFromCart(userId, productId);
  }

  @Delete('cart/clear/:userId')
  @ApiOperation({ summary: 'Clear entire cart' })
  clearCart(@Param('userId') userId: string) {
    return this.shopService.clearCart(userId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Create order from cart' })
  createOrderFromCart(@Body() createOrderFromCartDto: CreateOrderFromCartDto) {
    return this.shopService.createOrderFromCart(createOrderFromCartDto);
  }
}
