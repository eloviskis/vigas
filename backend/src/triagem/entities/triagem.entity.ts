import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';

export enum TriagemTipo {
  AUTOMATICA = 'AUTOMATICA',
  ASSISTIDA = 'ASSISTIDA',
  MANUAL = 'MANUAL',
}

export enum TriagemResultado {
  RECOMENDADO = 'RECOMENDADO',
  MULTIPLAS_OPCOES = 'MULTIPLAS_OPCOES',
  SEM_PROFISSIONAL = 'SEM_PROFISSIONAL',
  REQUER_VALIDACAO = 'REQUER_VALIDACAO',
}

@Entity({ name: 'triagens' })
export class Triagem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chamado_id' })
  chamadoId: string;

  @Column({ type: 'enum', enum: TriagemTipo })
  tipo: TriagemTipo;

  @Column({ type: 'enum', enum: TriagemResultado })
  resultado: TriagemResultado;

  @Column({ type: 'text', nullable: true })
  justificativa?: string;

  @Column({ name: 'profissional_recomendado_id', nullable: true })
  profissionalRecomendadoId?: string;

  @Column({ type: 'jsonb', nullable: true })
  opcoesProfissionais?: {
    id: string;
    nome: string;
    score: number;
    distancia?: number;
    disponibilidade?: boolean;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  critérios?: Record<string, any>;

  @Column({ type: 'integer', default: 0 })
  confiança: number; // 0-100

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  // Relations
  @ManyToOne(() => Chamado, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'chamado_id' })
  chamado?: Chamado;

  @ManyToOne(() => Profissional, (prof) => prof.triagensPendentes, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({ name: 'profissional_recomendado_id' })
  profissionalRecomendado?: Profissional;
}
