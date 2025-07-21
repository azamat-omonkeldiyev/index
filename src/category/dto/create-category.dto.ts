import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Hovuz aksessuarlari',
    description: 'Category name in Uzbek'
  })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({
    example: 'Аксессуары для бассейна',
    description: 'Category name in Russian'
  })
  @IsString()
  @IsNotEmpty()
  name_ru: string;
}