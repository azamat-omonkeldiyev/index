import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
    IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin Alex' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MaxLength(16)
  @MinLength(4)
  password: string;

  @ApiProperty({
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
