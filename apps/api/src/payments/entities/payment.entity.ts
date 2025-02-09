import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { BaseEntity } from '../../database/entities/base.entity';
import { PaymentStatus } from '../../enums/enums';
@Entity('payments')
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({ nullable: true })
  payment_method: string; // e.g., 'stripe'

  @Column({ nullable: true })
  payment_reference: string; // e.g., Stripe transaction ID
}
