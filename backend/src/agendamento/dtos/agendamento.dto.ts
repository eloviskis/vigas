import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { AgendamentoStatus } from '../entities/agendamento.entity';

export class CriarAgendamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chamadoId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profissionalId: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @IsNotEmpty()
  @IsDateString()
  dataHora: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(15)
  duracao?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slotId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class ConfirmarAgendamentoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class CancelarAgendamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  motivo: string;
}

export class AgendamentoResponseDto {
  id: string;
  chamadoId: string;
  profissionalId: string;
  slotId?: string;
  dataHora: Date;
  duracao: number;
  status: AgendamentoStatus;
  observacoes?: string;
  confirmadoEm?: Date;
  canceladoEm?: Date;
  inicioAtendimento?: Date;
  fimAtendimento?: Date;
  criadoEm: Date;
  atualizadoEm: Date;
}
