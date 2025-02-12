import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
  }

  async createProduct(createProductDto: CreateProductDto, merchantId: number): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      merchant: { id: merchantId },
    });
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findProductsByMerchant(merchantId: number): Promise<Product[]> {
    return this.productRepository.createQueryBuilder('product')
      .where('product.merchantId = :merchantId', { merchantId })
      .orderBy('product.created_at', 'ASC')
      .getMany();
  }

  async findProductById(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }

  async findProductByMerchant(productId: number, merchantId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId, merchant: { id: merchantId } },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found for merchant with ID ${merchantId}`);
    }
    return product;
  }

  async update(productId: number, merchantId: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findProductByMerchant(productId, merchantId);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(productId: number, merchantId: number): Promise<void> {
    const product = await this.findProductByMerchant(productId, merchantId);
    await this.productRepository.remove(product);
  }
}
