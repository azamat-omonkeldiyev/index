// consultation.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { QueryConsultationDto } from './dto/consultation-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsultationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateConsultationDto) {
    try {
      const consultation = await this.prisma.consultation.create({
        data: dto
      });

      return consultation;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async findAll(query: QueryConsultationDto) {
    try {
      const {
        name,
        phone,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      const where: any = {};

      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (phone) where.phone = { contains: phone, mode: 'insensitive' };

      const skip = (page - 1) * limit;
      const take = limit;

      const [consultations, total] = await Promise.all([
        this.prisma.consultation.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy]: sortOrder
          }
        }),
        this.prisma.consultation.count({ where })
      ]);

      return {
        data: consultations,
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
      const consultation = await this.prisma.consultation.findFirst({
        where: { id }
      });

      if (!consultation) {
        throw new NotFoundException({ message: 'Consultation not found!' });
      }

      return consultation;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async update(id: string, dto: UpdateConsultationDto) {
    try {
      // Check if consultation exists
      await this.findOne(id);

      const consultation = await this.prisma.consultation.update({
        where: { id },
        data: dto
      });

      return consultation;
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
      // Check if consultation exists
      await this.findOne(id);

      await this.prisma.consultation.delete({
        where: { id }
      });

      return { message: 'Consultation deleted successfully' };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}