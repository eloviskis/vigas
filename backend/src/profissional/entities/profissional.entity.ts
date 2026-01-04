import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import { Triagem } from './triagem.entity';

export enum ProfissionalStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  SUSPENSO = 'SUSPENSO',
  BLOQUEADO = 'BLOQUEADO',
}

@Index('idx_profissional_contexto', ['contextos'])
@Index('idx_profissional_status', ['status'])
@Entity({ name: 'profissionais' })
export class Profissional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'simple-array' })
  contextos: string[]; // Casa, Vida Digital, etc.

  @Column({ type: 'simple-array' })
  categorias: string[]; // Encanador, Eletricista, etc.

  @Column({ type: 'enum', enum: ProfissionalStatus, default: ProfissionalStatus.ATIVO })
  status: ProfissionalStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  score: number; // 0-5.00 rating

  @Column({ type: 'integer', default: 0 })
  totalServiços: number;

  @Column({ type: 'integer', default: 0 })
  serviçosConcluídos: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  taxaSatisfação: number;

  @Column({ type: 'jsonb', nullable: true })
  areasDiasponibilidade?: Record<string, any>;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  // Relations
  @OneToMany(() => Triagem, (triagem) => triagem.profissionalRecomendado, { eager: false })
  triagensPendentes?: Triagem[];
}
