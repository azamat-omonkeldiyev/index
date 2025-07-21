import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/order-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    try {
      const product = await this.prisma.product.findFirst({
        where: { id: dto.productId }
      });
      
      if (!product) {
        throw new NotFoundException({ message: 'Product not found!' });
      }

      const order = await this.prisma.order.create({
        data: dto,
        include: {
          product: {
            select: {
              id: true,
              image: true,
              price: true,
              discountedPrice: true,
              frame_ru: true,
              frame_uz: true,
              size: true,
              depth: true,
              status: true
            }
          }
        }
      });

      return order;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async findAll(query: QueryOrderDto) {
    try {
      const {
        productId,
        name,
        phone,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      const where: any = {};

      if (productId) where.productId = productId;
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (phone) where.phone = { contains: phone, mode: 'insensitive' };

      const skip = (page - 1) * limit;
      const take = limit;

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy]: sortOrder
          },
          include: {
            product: {
              select: {
                id: true,
                image: true,
                price: true,
                discountedPrice: true,
                frame_ru: true,
                frame_uz: true,
                size: true,
                depth: true,
                status: true,
                category: {
                  select: {
                    id: true,
                    name_ru: true,
                    name_uz: true
                  }
                }
              }
            }
          }
        }),
        this.prisma.order.count({ where })
      ]);

      return {
        data: orders,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id },
        include: {
          product: {
            select: {
              id: true,
              image: true,
              price: true,
              discountedPrice: true,
              frame_ru: true,
              frame_uz: true,
              size: true,
              depth: true,
              status: true,
              tools_ru: true,
              tools_uz: true,
              category: {
                select: {
                  id: true,
                  name_ru: true,
                  name_uz: true
                }
              }
            }
          }
        }
      });

      if (!order) {
        throw new NotFoundException({ message: 'Order not found!' });
      }

      return order;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async update(id: string, dto: UpdateOrderDto) {
    try {
      await this.findOne(id);

      if (dto.productId) {
        const product = await this.prisma.product.findFirst({
          where: { id: dto.productId }
        });
        
        if (!product) {
          throw new NotFoundException({ message: 'Product not found!' });
        }
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: dto,
        include: {
          product: {
            select: {
              id: true,
              image: true,
              price: true,
              discountedPrice: true,
              frame_ru: true,
              frame_uz: true,
              size: true,
              depth: true,
              status: true,
              category: {
                select: {
                  id: true,
                  name_ru: true,
                  name_uz: true
                }
              }
            }
          }
        }
      });

      return order;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      await this.prisma.order.delete({
        where: { id }
      });

      return { message: 'Order deleted successfully' };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}