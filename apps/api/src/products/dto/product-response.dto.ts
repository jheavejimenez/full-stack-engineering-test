import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class ProductResponseDto {
  @IsInt()
  id: number;

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
