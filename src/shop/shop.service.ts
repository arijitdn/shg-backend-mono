import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CartEntity,
  CartItemEntity,
  ProductEntity,
  CustomerEntity,
} from '@app/db/entities';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart.dto';
import { OrderService } from '../order/order.service';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private orderService: OrderService,
  ) {}

  async addToCart(addToCartDto: AddToCartDto) {
    const { userId, productId, quantity } = addToCartDto;

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get or create cart for user
    let cart = await this.cartRepository.findOne({
      where: { customerId: userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ customerId: userId, items: [] });
      cart = await this.cartRepository.save(cart);
    }

    // Check if item already exists in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Create new cart item
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return {
      success: true,
      message: 'Item added to cart successfully',
    };
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { customerId: userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      return {
        success: true,
        data: { items: [] },
      };
    }

    return {
      success: true,
      data: cart,
    };
  }

  async updateCartItem(updateCartDto: UpdateCartDto) {
    const { userId, productId, quantity } = updateCartDto;

    const cart = await this.cartRepository.findOne({
      where: { customerId: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return {
      success: true,
      message: 'Cart updated successfully',
    };
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartRepository.findOne({
      where: { customerId: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);

    return {
      success: true,
      message: 'Item removed from cart successfully',
    };
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { customerId: userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartItemRepository.remove(cart.items);

    return {
      success: true,
      message: 'Cart cleared successfully',
    };
  }

  async createOrderFromCart(createOrderFromCartDto: CreateOrderFromCartDto) {
    const { customerId, customerName, deliveryAddress } =
      createOrderFromCartDto;

    // Get cart with items
    const cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['items', 'items.product'],
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const orders: any[] = [];

    // Create an order for each item in the cart
    for (const item of cart.items) {
      const orderDto = {
        orderId: createId(),
        productId: item.productId,
        customerId,
        customerName,
        quantity: item.quantity,
        originalPrice: item.product.price,
        orderPrice: item.product.price * item.quantity,
        deliveryAddress,
      };

      const order = await this.orderService.create(orderDto);
      orders.push(order);
    }

    // Clear the cart after creating orders
    await this.clearCart(customerId);

    return {
      success: true,
      message: 'Orders created successfully',
      data: orders,
    };
  }
}
