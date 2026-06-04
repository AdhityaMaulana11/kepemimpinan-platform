import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Kepemimpinan Dasar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'kepemimpinan-dasar' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'Materi dasar kepemimpinan' })
  @IsOptional()
  @IsString()
  description?: string;
}
