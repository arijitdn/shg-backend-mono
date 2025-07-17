import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { DbService } from '@app/common/db/db.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly dbService: DbService) {}

  async create(createOrderDto: CreateOrderDto) {
    // Calculate orderPrice based on originalPrice and discount (flat or percent)
    let { originalPrice, discount = 0, discountType } = createOrderDto;
    let orderPrice = originalPrice;
    if (discount > 0 && discountType === 'percent') {
      orderPrice = originalPrice - (originalPrice * discount) / 100;
    } else if (discount > 0 && discountType === 'flat') {
      orderPrice = originalPrice - discount;
    }
    const order = this.dbService.orderRepo.create({
      ...createOrderDto,
      orderPrice,
      status: 'Created',
    });
    const savedOrder = await this.dbService.orderRepo.save(order);
    return {
      ...savedOrder,
      originalPrice: savedOrder.originalPrice,
      discount: savedOrder.discount,
      discountType: savedOrder.discountType,
      orderPrice: savedOrder.orderPrice,
    };
  }

  async findAll() {
    return await this.dbService.orderRepo.find();
  }

  async findOne(id: string) {
    return await this.dbService.orderRepo.findOneBy({
      orderId: id,
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const {
      orderId,
      productId,
      customerId,
      trlmId,
      discount,
      orderPrice,
      originalPrice,
      ...allowedUpdates
    } = updateOrderDto;
    return await this.dbService.orderRepo.update(id, allowedUpdates);
  }

  async remove(id: string) {
    return await this.dbService.orderRepo.delete(id);
  }

  async findAllByTrlmId(trlmId: string) {
    return await this.dbService.orderRepo.find({ where: { trlmId } });
  }

  async findAllByCustomerId(customerId: string) {
    return await this.dbService.orderRepo.find({ where: { customerId } });
  }

  async updateOrderStatus(id: string, newStatus: string) {
    const order = await this.dbService.orderRepo.findOneBy({ orderId: id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    // Set all status booleans to false by default
    let statusUpdate = {
      isDispatched: false,
      isDelivered: false,
      isCancelled: false,
      isReturn: false,
      status: newStatus,
    };
    // Set only the selected status to true
    if (newStatus === 'isDispatched') statusUpdate.isDispatched = true;
    if (newStatus === 'isDelivered') statusUpdate.isDelivered = true;
    if (newStatus === 'isCancelled') statusUpdate.isCancelled = true;
    if (newStatus === 'isReturn') statusUpdate.isReturn = true;
    return await this.dbService.orderRepo.update(id, statusUpdate);
  }

  async cancelOrder(id: string) {
    const order = await this.dbService.orderRepo.findOneBy({ orderId: id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow cancellation if order is a customer order
    if (!order.customerId) {
      throw new ForbiddenException('Only customer orders can be cancelled');
    }

    return await this.dbService.orderRepo.update(id, {
      isCancelled: true,
      isDispatched: false,
      isDelivered: false,
      isReturn: false,
      status: 'isCancelled',
    });
  }
}
