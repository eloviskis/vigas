import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsNumber } from 'class-validator';
import { TriagemTipo } from '../entities/triagem.entity';

export class CriarTriagemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chamadoId: string;

  @ApiProperty({ enum: TriagemTipo, required: false })
  @IsOptional()
  @IsEnum(TriagemTipo)
  tipo?: TriagemTipo;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  critérios?: Record<string, any>;
}

export class RecomendarProfissionalDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  triagemId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profissionalId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  justificativa?: string;
}

export class TriagemResponseDto {
  id: string;
  chamadoId: string;
  tipo: TriagemTipo;
  resultado: string;
  profissionalRecomendadoId?: string;
  confiança: number;
  criadoEm: Date;
}
