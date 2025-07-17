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

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('createOrder')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('getAllOrders')
  getAllOrders() {
    return this.orderService.findAll();
  }

  @Get('getOrderByTrlmId/:trlmId')
  getOrderByTrlmId(@Param('trlmId') trlmId: string) {
    return this.orderService.findAllByTrlmId(trlmId);
  }

  @Get('getOrderByCustomerId/:customerId')
  getOrderByCustomerId(@Param('customerId') customerId: string) {
    return this.orderService.findAllByCustomerId(customerId);
  }

  @Get('getOrderById/:id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch('updateOrder/:id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch('updateOrderStatus/:id')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.orderService.updateOrderStatus(id, body.status);
  }

  @Delete('deleteOrder/:id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Patch('cancelOrder/:id')
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
