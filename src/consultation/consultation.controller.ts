// consultation.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { QueryConsultationDto } from './dto/consultation-query.dto';
import { Roles } from 'src/admin/decorators/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Consultations')
@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new consultation request' })
  @ApiResponse({ status: 201, description: 'Consultation created successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationService.create(createConsultationDto);
  }

  @Roles(UserRole.SUPERADMIN,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all consultations with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Consultations retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(@Query() query: QueryConsultationDto) {
    return this.consultationService.findAll(query);
  }

  @Roles(UserRole.SUPERADMIN,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get consultation by ID' })
  @ApiResponse({ status: 200, description: 'Consultation found' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne(@Param('id') id: string) {
    return this.consultationService.findOne(id);
  }

  @Roles(UserRole.SUPERADMIN,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update consultation by ID' })
  @ApiResponse({ status: 200, description: 'Consultation updated successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Param('id') id: string, @Body() updateConsultationDto: UpdateConsultationDto) {
    return this.consultationService.update(id, updateConsultationDto);
  }

  @Roles(UserRole.SUPERADMIN,UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete consultation by ID' })
  @ApiResponse({ status: 200, description: 'Consultation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id') id: string) {
    return this.consultationService.remove(id);
  }
}