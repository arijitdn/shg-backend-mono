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

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
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
