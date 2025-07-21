import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProductDto } from './dto/product-query.dto';

@Injectable()
export class ProductService {
 constructor(private readonly prisma: PrismaService) {}

 async create(dto: CreateProductDto) {
   try {
     let category = await this.prisma.category.findFirst({where:{id:dto.categoryId}})
     if(!category){
       throw new NotFoundException({message: 'category not found!'})
     }
     const product = await this.prisma.product.create({data:dto})
     return product
   } catch (error) {
     console.log(error)
     if (error instanceof NotFoundException) {
       throw error
     }
     throw new InternalServerErrorException({message: error.message})
   }
 }

 async findAll(query: QueryProductDto) {
   try {
     const {
       categoryId,
       frame,
       size,
       depth,
       status,
       page = 1,
       limit = 10,
       sortBy = 'createdAt',
       sortOrder = 'desc'
     } = query;

     const where: any = {};
     
     if (categoryId) where.categoryId = categoryId;
     if (frame) where.OR = [
       { frame_ru: { contains: frame, mode: 'insensitive' } },
       { frame_uz: { contains: frame, mode: 'insensitive' } }
     ];
     if (size) where.size = { contains: size, mode: 'insensitive' };
     if (depth) where.depth = parseFloat(depth);
     if (status) where.status = status;

     const skip = (page - 1) * limit;
     const take = limit;

     const [products, total] = await Promise.all([
       this.prisma.product.findMany({
         where,
         skip,
         take,
         orderBy: {
           [sortBy]: sortOrder
         },
         include: {
           category: {
             select: {
               id: true,
               name_ru: true,
               name_uz: true
             }
           }
         }
       }),
       this.prisma.product.count({ where })
     ]);

     return {
       data: products,
       meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
     };
   } catch (error) {
     console.log(error)
     throw new InternalServerErrorException({message: error.message})
   }
 }

 async findOne(id: string) {
   try {
     const product = await this.prisma.product.findFirst({
       where: { id },
       include: {
         category: {
           select: {
             id: true,
             name_ru: true,
             name_uz: true
           }
         }
       }
     });

     if (!product) {
       throw new NotFoundException({message: 'Product not found!'});
     }

     return product;
   } catch (error) {
     console.log(error)
     if (error instanceof NotFoundException) {
       throw error
     }
     throw new InternalServerErrorException({message: error.message})
   }
 }

 async update(id: string, dto: UpdateProductDto) {
   try {
     await this.findOne(id);
     
     if (dto.categoryId) {
       const category = await this.prisma.category.findFirst({
         where: { id: dto.categoryId }
       });
       if (!category) {
         throw new NotFoundException({message: 'Category not found!'});
       }
     }

     const product = await this.prisma.product.update({
       where: { id },
       data: dto,
       include: {
         category: {
           select: {
             id: true,
             name_ru: true,
             name_uz: true
           }
         }
       }
     });

     return product;
   } catch (error) {
     console.log(error)
     if (error instanceof NotFoundException) {
       throw error
     }
     throw new InternalServerErrorException({message: error.message})
   }
 }

 async remove(id: string) {
   try {
     await this.findOne(id);

     await this.prisma.product.delete({
       where: { id }
     });

     return {message: 'Product deleted successfully'};
   } catch (error) {
     console.log(error)
     if (error instanceof NotFoundException) {
       throw error
     }
     throw new InternalServerErrorException({message: error.message})
   }
 }
}