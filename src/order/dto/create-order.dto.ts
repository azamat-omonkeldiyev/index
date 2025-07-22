import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '+998901234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Tashkent, Chilanzar district, 1st street, house 10' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'product-uuid' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  check: boolean;
}