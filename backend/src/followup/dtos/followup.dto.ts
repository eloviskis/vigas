import { IsEnum, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { FollowupTipo, FollowupStatus } from '../entities/followup.entity';

export class CriarFollowupDto {
  @IsString()
  agendamentoId: string;

  @IsEnum(FollowupTipo)
  tipo: FollowupTipo;

  @IsString()
  mensagem: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class ResponderFollowupDto {
  @IsString()
  resposta: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  avaliacaoGeral?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  avaliacaoProfissional?: number;

  @IsOptional()
  @IsString()
  comentarios?: string;
}

export class FollowupResponseDto {
  id: string;
  agendamentoId: string;
  tipo: FollowupTipo;
  status: FollowupStatus;
  mensagem: string;
  resposta?: string;
  avaliacaoGeral?: number;
  avaliacaoProfissional?: number;
  criadoEm: Date;
}
