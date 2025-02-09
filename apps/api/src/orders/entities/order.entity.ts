import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from '../../database/entities/base.entity';
import { OrderStatus } from '../../enums/enums';


@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, user => user.orders, { nullable: false })
  customer: User;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column('decimal')
  total_price: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];
}
