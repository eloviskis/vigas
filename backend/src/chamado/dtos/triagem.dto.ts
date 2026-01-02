import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ChamadoPrioridade } from '../entities/chamado.entity';

export enum ProfissionalEspecialidade {
  REFORMA = 'REFORMA',
  LIMPEZA = 'LIMPEZA',
  JARDIM = 'JARDIM',
  MANUTENCAO = 'MANUTENCAO',
  PINTURA = 'PINTURA',
  MUDANCA = 'MUDANCA',
  ELETRICISTA = 'ELETRICISTA',
  ENCANADOR = 'ENCANADOR',
  CARPINTEIRO = 'CARPINTEIRO',
}

export class CriteriosTriagemDto {
  @IsString()
  chamadoId: string;

  @IsEnum(ProfissionalEspecialidade)
  especialidadeRequerida: ProfissionalEspecialidade;

  @IsEnum(ChamadoPrioridade)
  prioridade: ChamadoPrioridade;

  @IsOptional()
  @IsNumber()
  valorMaximoHora?: number;

  @IsOptional()
  @IsNumber()
  ratingMinimoRequired?: number;

  @IsOptional()
  @IsBoolean()
  preferirAvaliados?: boolean;

  @IsOptional()
  @IsString()
  localizacao?: string;
}

export class ProfissionalScoreDto {
  id: string;
  especialidade: string;
  nome: string;
  rating: number;
  chamadosEmAndamento: number;
  valorHora: number;
  aceitaUrgentes: boolean;
  score: number; // Pontuação total (0-100)
  matchPercentual: number; // % de compatibilidade
}

export class ResultadoTriagemDto {
  chamadoId: string;
  triageType: 'AUTOMATICA' | 'ASSISTIDA';
  timestamp: Date;
  profissionaisOrdenados: ProfissionalScoreDto[];
  profissionalRecomendado: ProfissionalScoreDto; // Melhor match
  podeSerAutomatizado: boolean; // Se score > 75%
  justificativa: string;
}
