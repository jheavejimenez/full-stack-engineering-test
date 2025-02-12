import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, UserRole } from '../enums/enums';
import { OrderResponseDto } from './dto/order-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {
  }

  async createOrder(createOrderDto: CreateOrderDto, customerId: number): Promise<OrderResponseDto> {
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
        product: { id: item.product.id },
        quantity: item.quantity,
        price: item.price,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    // // Update the stock of the products
    // for (const item of items) {
    //   const product = await this.productsService.findProductById(item.productId);
    //   product.stock -= item.quantity;
    //   await this.productsService.updateProductStock(product.id, product.stock);
    // }

      const orderWithItems = await this.findOne(savedOrder.id, customerId);
    return plainToInstance(OrderResponseDto, orderWithItems);
  }

  async findOrdersByMerchant(merchantId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .where('product.merchantId = :merchantId', { merchantId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
    return plainToInstance(OrderResponseDto, orders);
  }

  async findAll(customerId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['items', 'items.product'],
    });
    return plainToInstance(OrderResponseDto, orders);
  }

  async findPendingOrders(customerId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.find({
      where: { customer: { id: customerId }, status: OrderStatus.PENDING },
      relations: ['items', 'items.product'],
    });
    if (!orders) {
      throw new NotFoundException(`No pending order found for customer with ID ${customerId}.`);
    }

    return plainToInstance(OrderResponseDto, orders);
  }

  async findOne(orderId: number, customerId: number): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customerId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this user.`);
    }

    return plainToInstance(OrderResponseDto, order);
  }

  async updateOrderStatus(orderId: number, userId: number, status: OrderStatus, role: UserRole): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'items.product.merchant'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (role === UserRole.MERCHANT) {
      const invalidItems = order.items.filter(item => item.product.merchant.id !== userId);
      if (invalidItems.length > 0) {
        throw new BadRequestException(`Order contains products that do not belong to merchant with ID ${userId}.`);
      }
    } else if (role === UserRole.CUSTOMER) {
      if (order.customer.id !== userId) {
        throw new BadRequestException(`Order does not belong to customer with ID ${userId}.`);
      }
      if (status !== OrderStatus.COMPLETED) {
        throw new BadRequestException(`Customer can only update the status to COMPLETED.`);
      }
    } else {
      throw new BadRequestException(`Invalid user role.`);
    }

    order.status = status;
    const updatedOrder = await this.orderRepository.save(order);
    return plainToInstance(OrderResponseDto, updatedOrder);
  }

  async updateOrder(orderId: number, userId: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['customer', 'items', 'items.product', 'items.product.merchant'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (order.customer.id !== userId) {
      throw new BadRequestException(`Order does not belong to customer with ID ${userId}.`);
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

          // const quantityDifference = itemDto.quantity - existingItem.quantity;
          // const product = await this.productsService.findProductById(itemDto.id);
          // product.stock -= quantityDifference;
          // await this.productsService.updateProductStock(product.id, product.stock);
          //
          existingItem.quantity = itemDto.quantity;
          existingItem.price = itemDto.price;
        } else {
          const newItem = this.orderItemRepository.create({
            order,
            product: { id: itemDto.product.id },
            quantity: itemDto.quantity,
            price: itemDto.price,
          });
          //
          // const product = await this.productsService.findProductById(itemDto.id);
          // product.stock -= itemDto.quantity;
          // await this.productsService.updateProductStock(product.id, product.stock);

          existingItems.push(newItem);
        }
      }

      await this.orderItemRepository.save(existingItems);

      // Update the order items with the new quantities and prices
      order.items = existingItems;
    }

    order.totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updatedOrder = await this.orderRepository.save(order);
    return plainToInstance(OrderResponseDto, updatedOrder);
  }

  async removeOrder(orderId: number, customerId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customerId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this user.`);
    }

    await this.orderRepository.remove(order);
  }

}
