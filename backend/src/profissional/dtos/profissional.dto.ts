import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ProfissionalStatus } from '../entities/profissional.entity';

export class CriarProfissionalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  contextos: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  categorias: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class AtualizarProfissionalDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  contextos?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  categorias?: string[];

  @ApiProperty({ required: false, enum: ProfissionalStatus })
  @IsOptional()
  @IsEnum(ProfissionalStatus)
  status?: ProfissionalStatus;
}

export class ProfissionalResponseDto {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  contextos: string[];
  categorias: string[];
  status: ProfissionalStatus;
  score: number;
  totalServiços: number;
  serviçosConcluídos: number;
  taxaSatisfação: number;
  criadoEm: Date;
}
