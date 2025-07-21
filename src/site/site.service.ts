// site.service.ts
import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSiteDto) {
    try {
      const existingSite = await this.prisma.site.findFirst();
      if (existingSite) {
        throw new BadRequestException({ message: 'Site settings already exist. Use update instead.' });
      }

      const site = await this.prisma.site.create({
        data: dto
      });

      return site;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async findOne() {
    try {
      const site = await this.prisma.site.findFirst();

      if (!site) {
        throw new NotFoundException({ message: 'Site settings not found!' });
      }

      return site;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async update(dto: UpdateSiteDto) {
    try {
      const existingSite = await this.findOne();

      const site = await this.prisma.site.update({
        where: { id: existingSite.id },
        data: dto
      });

      return site;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  async getOrCreate() {
    try {
      const site = await this.prisma.site.findFirst();
      
      if (!site) {
        return null;
      }

      return site;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}