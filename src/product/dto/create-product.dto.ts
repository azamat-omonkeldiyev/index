import { ApiProperty } from "@nestjs/swagger";
import { Status, ToolRu, ToolUz } from "@prisma/client";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProductDto{
  @ApiProperty({ example: 'hhtp//image.png' })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ example: 'category-uuid' })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({example: 2500000})
  @IsNumber()
  price: number

  @ApiProperty({example: 10})
  @IsNumber()
  count: number

  @ApiProperty({example: 2200000})
  @IsNumber()
  discountedPrice: number

  @ApiProperty({example: "Прямоугольная"})
  @IsString()
  frame_ru: string

  @ApiProperty({example: "To'rtburchak"})
  @IsString()
  frame_uz: string

  @ApiProperty({example: "3.66"})
  @IsString()
  size: string

  @ApiProperty({example: 76})
  @IsNumber()
  depth: number

  @ApiProperty({
    example: Status.Рекомендуем,
  })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    example: [ToolRu.АрматураПодключения, ToolRu.ВентилиИМанометры],
    enum: ToolRu,
    isArray: true,
    description: 'Array of Russian tools',
    required: false
  })
  @IsArray()
  @IsEnum(ToolRu, { each: true })
  tools_ru: ToolRu[];

  @ApiProperty({
    example: [ToolUz.UlashArmaturasi, ToolUz.VentilManometrlar],
    enum: ToolUz,
    isArray: true,
    description: 'Array of Uzbek tools',
    required: false
  })
  @IsArray()
  @IsEnum(ToolUz, { each: true })
  tools_uz: ToolUz[];
}