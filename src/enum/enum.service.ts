import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole,ToolRu,ToolUz, Status } from '@prisma/client';

@Injectable()
export class EnumService {
  constructor(private readonly prisma: PrismaService) {}

  findUserRole() {
    return UserRole
  }

  findToolRU() {
    return ToolRu
  }

  findToolUZ() {
    return ToolUz
  }

  findStatus() {
    return Status
  }

 
}
