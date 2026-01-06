import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CriarOrcamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chamadoId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profissionalId: string;

  @ApiProperty({ description: 'Valor do serviço em reais' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  valorServico: number;

  @ApiProperty({ description: 'Valor do deslocamento', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorDeslocamento?: number;

  @ApiProperty({ description: 'Valor dos materiais', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorMateriais?: number;

  @ApiProperty({ description: 'Descrição detalhada do orçamento' })
  @IsNotEmpty()
  @IsString()
  descricaoDetalhada: string;

  @ApiProperty({ description: 'Prazo estimado de execução', example: '2-3 horas' })
  @IsNotEmpty()
  @IsString()
  prazoExecucao: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class AprovarOrcamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orcamentoId: string;
}

export class RecusarOrcamentoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orcamentoId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  motivoRecusa?: string;
}

export class OrcamentoResponseDto {
  id: string;
  chamadoId: string;
  profissionalId: string;
  profissionalNome?: string;
  profissionalScore?: number;
  valorServico: number;
  valorDeslocamento: number;
  valorMateriais: number;
  valorTotal: number;
  descricaoDetalhada: string;
  prazoExecucao: string;
  validadeAte: Date;
  status: string;
  observacoes?: string;
  motivoRecusa?: string;
  criadoEm: Date;
  aprovadoEm?: Date;
}
