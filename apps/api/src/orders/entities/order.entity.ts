import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from '../../database/entities/base.entity';
import { OrderStatus } from '../../enums/enums';
import { Payment } from '../../payments/entities/payment.entity';


@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, user => user.orders, { nullable: false })
  customer: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => Payment, payment => payment.order, { cascade: true })
  payment: Payment;
}
