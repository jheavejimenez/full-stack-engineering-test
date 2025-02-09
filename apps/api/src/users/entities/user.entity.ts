import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { BaseEntity } from '../../database/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

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

  @Column({
    type: 'enum',
    enum: ['merchant', 'customer'],
    default: 'customer',
  })
  @IsEnum(['merchant', 'customer'])
  role: string;
}
