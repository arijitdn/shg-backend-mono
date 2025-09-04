import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { DbService } from '@app/db/db.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@app/db/enums/order-status';
import { normalizePrice } from '../utils/price.utils';

@Injectable()
export class OrderService {
  constructor(private readonly dbService: DbService) {}

  async create(createOrderDto: CreateOrderDto) {
    // Ensure prices are in paise format
    let { originalPrice, discount = 0, discountType, status } = createOrderDto;
    originalPrice = normalizePrice(originalPrice);

    // Calculate orderPrice based on originalPrice and discount (flat or percent)
    let orderPrice = originalPrice;
    if (discount > 0 && discountType === 'percent') {
      orderPrice = originalPrice - (originalPrice * discount) / 100;
    } else if (discount > 0 && discountType === 'flat') {
      // Ensure discount is also in paise if it's a flat amount
      const discountInPaise = normalizePrice(discount);
      orderPrice = originalPrice - discountInPaise;
    }

    const order = this.dbService.orderRepo.create({
      ...createOrderDto,
      originalPrice,
      orderPrice,
      status: status || OrderStatus.CREATED,
      statusUpdatedAt: new Date(),
    });
    const savedOrder = await this.dbService.orderRepo.save(order);
    return savedOrder;
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

  async updateOrderStatus(id: string, newStatus: OrderStatus) {
    const order = await this.dbService.orderRepo.findOneBy({ orderId: id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    // Only update the status field
    return await this.dbService.orderRepo.update(id, {
      status: newStatus,
      ...(newStatus === OrderStatus.CONFIRMED && { confirmedAt: new Date() }),
      ...(newStatus === OrderStatus.SHIPPED && { shippedAt: new Date() }),
      ...(newStatus === OrderStatus.DELIVERED && { deliveredAt: new Date() }),
      ...(newStatus === OrderStatus.CANCELLED && { cancelledAt: new Date() }),
    });
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
      status: OrderStatus.CANCELLED,
      statusUpdatedAt: new Date(),
      cancelledAt: new Date(),
    });
  }
}
