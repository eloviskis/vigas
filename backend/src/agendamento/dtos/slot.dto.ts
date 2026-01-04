import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CriarSlotDto {
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
  observacoes?: string;
}

export class AtualizarSlotDisponibilidadeDto {
  @ApiProperty()
  @IsNotEmpty()
  disponivel: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class SlotResponseDto {
  id: string;
  profissionalId: string;
  dataHora: Date;
  duracao: number;
  disponivel: boolean;
  agendamentoId?: string;
  criadoEm: Date;
}
