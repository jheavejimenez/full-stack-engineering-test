import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
  }

  async createProduct(createProductDto: CreateProductDto, merchantId: number): Promise<ProductResponseDto> {
    const product = this.productRepository.create({
      ...createProductDto,
      merchant: { id: merchantId },
    });
    const savedProduct = await this.productRepository.save(product);
    return plainToInstance(ProductResponseDto, savedProduct);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find();
    return plainToInstance(ProductResponseDto, products);
  }

  async findProductsByMerchant(merchantId: number): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.createQueryBuilder('product')
      .where('product.merchantId = :merchantId', { merchantId })
      .orderBy('product.created_at', 'ASC')
      .getMany();
    return plainToInstance(ProductResponseDto, products);
  }

  async findProductById(productId: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return plainToInstance(ProductResponseDto, product);
  }

  async findProductByMerchant(productId: number, merchantId: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: productId, merchant: { id: merchantId } },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found for merchant with ID ${merchantId}`);
    }
    return plainToInstance(ProductResponseDto, product);
  }

  async update(productId: number, merchantId: number, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: productId, merchant: { id: merchantId } },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found for merchant with ID ${merchantId}`);
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    return plainToInstance(ProductResponseDto, updatedProduct);
  }

  async remove(productId: number, merchantId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId, merchant: { id: merchantId } },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found for merchant with ID ${merchantId}`);
    }

    await this.productRepository.remove(product);
  }
}
