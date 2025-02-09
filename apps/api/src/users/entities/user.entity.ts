import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { BaseEntity } from '../../database/entities/base.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
import { UserRole } from '../../enums/enums';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToMany(() => Product, product => product.merchant)
  products: Product[];

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @MinLength(8)
  password: string;

  @Column({ nullable: false })
  @IsString()
  name: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
