import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ example: 'Admin Alex' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'StrongPass123' })
  @MaxLength(16)
  @MinLength(4)
  @IsString()
  password: string;
}
