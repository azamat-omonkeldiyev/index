// site.controller.ts
import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/admin/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Site Settings')
@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create site settings (only once)' })
  @ApiResponse({ status: 201, description: 'Site settings created successfully' })
  @ApiResponse({ status: 400, description: 'Site settings already exist' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.create(createSiteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get site settings' })
  @ApiResponse({ status: 200, description: 'Site settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Site settings not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findOne() {
    return this.siteService.findOne();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update site settings' })
  @ApiResponse({ status: 200, description: 'Site settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Site settings not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Body() updateSiteDto: UpdateSiteDto) {
    return this.siteService.update(updateSiteDto);
  }

  @Get('init')
  @ApiOperation({ summary: 'Get site settings or return null if not exists' })
  @ApiResponse({ status: 200, description: 'Site settings or null returned' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getOrCreate() {
    return this.siteService.getOrCreate();
  }
}