import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          OR: [
            { name_uz: dto.name_uz },
            { name_ru: dto.name_ru }
          ]
        }
      });

      if (existingCategory) {
        throw new ConflictException({message: 'Category with this name already exists!'});
      }

      const category = await this.prisma.category.create({data: dto});
      return category;
    } catch (error) {
      console.log(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({message: error.message});
    }
  }

  async findAll(query: QueryCategoryDto) {
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      const where: any = {};
      
      if (search) {
        where.OR = [
          { name_uz: { contains: search, mode: 'insensitive' } },
          { name_ru: { contains: search, mode: 'insensitive' } }
        ];
      }

      const skip = (page - 1) * limit;
      const take = limit;

      const [categories, total] = await Promise.all([
        this.prisma.category.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy]: sortOrder
          },
          include: {
            Product: true,
          }
        }),
        this.prisma.category.count({ where })
      ]);

      return {
        data: categories,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        }
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({message: error.message});
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findFirst({
        where: { id },
        include: {
          _count: {
            select: {
              Product: true
            }
          }
        }
      });

      if (!category) {
        throw new NotFoundException({message: 'Category not found!'});
      }

      return category;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({message: error.message});
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      await this.findOne(id); 
      
      if (dto.name_uz || dto.name_ru) {
        const existingCategory = await this.prisma.category.findFirst({
          where: {
            AND: [
              { id: { not: id } },
              {
                OR: [
                  { name_uz: dto.name_uz },
                  { name_ru: dto.name_ru }
                ]
              }
            ]
          }
        });

        if (existingCategory) {
          throw new ConflictException({message: 'Category with this name already exists!'});
        }
      }

      const category = await this.prisma.category.update({
        where: { id },
        data: dto,
        include: {
          _count: {
            select: {
              Product: true
            }
          }
        }
      });

      return category;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({message: error.message});
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id); 

      const productsCount = await this.prisma.product.count({
        where: { categoryId: id }
      });

      if (productsCount > 0) {
        throw new ConflictException({
          message: `Cannot delete category. It has ${productsCount} products associated with it.`
        });
      }

      await this.prisma.category.delete({
        where: { id }
      });

      return {message: 'Category deleted successfully'};
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({message: error.message});
    }
  }

}