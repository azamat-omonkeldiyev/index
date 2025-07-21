import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnumService } from './enum.service';


@Controller('enum')
export class EnumController {
  constructor(private readonly enumService: EnumService) {}

  @Get('userrole')
  findAllRole() {
    return this.enumService.findUserRole();
  }

  @Get('toolru')
  findAllToolRu() {
    return this.enumService.findToolRU();
  }

  @Get('tooluz')
  findAllToolUz() {
    return this.enumService.findToolUZ();
  }

  @Get('status')
  findAllStatus() {
    return this.enumService.findStatus();
  }

}
