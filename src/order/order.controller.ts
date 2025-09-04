import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@app/db/enums/order-status';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// DTO for payment success order creation
export class CreateOrderFromPaymentDto {
  paymentId: string;
  orderId: string; // Razorpay order ID
  productId: string;
  quantity: number;
  totalAmount: number; // Amount in paise
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new order' })
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Post('create-from-payment')
  @ApiOperation({ summary: 'Create order from successful payment' })
  async createOrderFromPayment(
    @Body() paymentOrderDto: CreateOrderFromPaymentDto,
  ) {
    // Parse delivery address (simple approach)
    const addressParts = paymentOrderDto.deliveryAddress.split('\n');

    // Convert payment data to order DTO
    const createOrderDto: CreateOrderDto = {
      orderId: paymentOrderDto.orderId,
      productId: paymentOrderDto.productId,
      customerId: `cust_${Date.now()}`,
      customerName: paymentOrderDto.customerName,
      quantity: paymentOrderDto.quantity,
      originalPrice: paymentOrderDto.totalAmount, // Already in paise
      orderPrice: paymentOrderDto.totalAmount, // Same as original price
      status: OrderStatus.CONFIRMED,
      confirmedAt: new Date().toISOString(),
      deliveryAddress: {
        city: addressParts[0] || 'Not specified',
        state: addressParts[1] || 'Not specified',
        pin: '000000',
        district: addressParts[2] || 'Not specified',
        village: addressParts[3] || 'Not specified',
        phoneNumber: paymentOrderDto.customerPhone,
        addressType: 'home',
      },
    };

    return this.orderService.create(createOrderDto);
  }

  @Get('/')
  getAllOrders() {
    return this.orderService.findAll();
  }

  @Get('trlm/:trlmId')
  getOrderByTrlmId(@Param('trlmId') trlmId: string) {
    return this.orderService.findAllByTrlmId(trlmId);
  }

  @Get('customer/:customerId')
  getOrderByCustomerId(@Param('customerId') customerId: string) {
    return this.orderService.findAllByCustomerId(customerId);
  }

  @Get('/:id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch('update/:id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch('update-status/:id')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.orderService.updateOrderStatus(id, body.status);
  }

  @Delete('delete/:id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Patch('cancel/:id')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
