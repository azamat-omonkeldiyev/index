import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSiteDto {
  @ApiProperty({ example: '+998901234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Tashkent, Chilanzar district, 1st street, house 10' })
  @IsNotEmpty()
  @IsString()
  address_ru: string;

  @ApiProperty({ example: 'Toshkent, Chilonzor tumani, 1-ko\'cha, 10-uy' })
  @IsNotEmpty()
  @IsString()
  address_uz: string;

  @ApiProperty({ example: 'Пн-Пт: 9:00-18:00, Сб-Вс: 10:00-16:00' })
  @IsNotEmpty()
  @IsString()
  work_time_ru: string;

  @ApiProperty({ example: 'Dush-Jum: 9:00-18:00, Shan-Yak: 10:00-16:00' })
  @IsNotEmpty()
  @IsString()
  work_time_uz: string;

  @ApiProperty({ example: 'https://t.me/yourcompany' })
  @IsNotEmpty()
  @IsString()
  telegram: string;

  @ApiProperty({ example: 'https://instagram.com/yourcompany' })
  @IsNotEmpty()
  @IsString()
  instagram: string;
}