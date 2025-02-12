import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class ProductResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  description: string;
}
