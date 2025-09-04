import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create a Razorpay order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.paymentsService.createOrder(
      createOrderDto.amount,
      createOrderDto.currency || 'INR',
      createOrderDto.receipt,
    );
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a Razorpay payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment verification result',
  })
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(
      verifyPaymentDto.razorpay_order_id,
      verifyPaymentDto.razorpay_payment_id,
      verifyPaymentDto.razorpay_signature,
    );
  }

  @Get('payment/:paymentId')
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({
    status: 200,
    description: 'Payment details retrieved successfully',
  })
  async getPayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPayment(paymentId);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
  })
  async getOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.getOrder(orderId);
  }
}
