import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-oder.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {
  }

  async createOrder(createOrderDto: CreateOrderDto, customerId: number): Promise<Order> {
    const { items, status } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must have at least one item.');
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = this.orderRepository.create({
      customer: { id: customerId },
      status,
      totalPrice,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = items.map((item) =>
      this.orderItemRepository.create({
        order: savedOrder,
        product: { id: item.productId },
        quantity: item.quantity,
        price: item.price,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    return this.findOne(savedOrder.id, customerId);
  }

  async findOrdersByMerchant(merchantId: number): Promise<Order[]> {
    return this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('product.merchantId = :merchantId', { merchantId })
      .getMany();
  }

  async findAll(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.product'],
    });
  }

  async findOne(orderId: number, customerId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customerId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this user.`);
    }

    return order;
  }

  async updateOrder(orderId: number, customerId: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(orderId, customerId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this user.`);
    }

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.items) {
      const existingItems = await this.orderItemRepository.find({ where: { order: { id: orderId } } });
      const existingItemsMap = new Map(existingItems.map(item => [item.id, item]));

      for (const itemDto of updateOrderDto.items) {
        const existingItem = existingItemsMap.get(itemDto.id);
        if (existingItem) {
          existingItem.quantity = itemDto.quantity;
          existingItem.price = itemDto.price;
        } else {
          const newItem = this.orderItemRepository.create({
            order,
            product: { id: itemDto.id },
            quantity: itemDto.quantity,
            price: itemDto.price,
          });
          existingItems.push(newItem);
        }
      }

      await this.orderItemRepository.save(existingItems);
    }

    return this.orderRepository.save(order);
  }

  async removeOrder(orderId: number, customerId: number): Promise<void> {
    const order = await this.findOne(orderId, customerId);

    await this.orderRepository.remove(order);
  }
}
