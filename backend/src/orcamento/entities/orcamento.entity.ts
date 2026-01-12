import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';

export enum OrcamentoStatus {
  ENVIADO = 'ENVIADO',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
  EXPIRADO = 'EXPIRADO',
  CANCELADO = 'CANCELADO',
}

@Entity({ name: 'orcamentos' })
export class Orcamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chamadoId: string;

  @ManyToOne(() => Chamado, { lazy: true })
  @JoinColumn({ name: 'chamadoId' })
  chamado: Promise<Chamado>;

  @Column()
  profissionalId: string;

  @ManyToOne(() => Profissional, { lazy: true })
  @JoinColumn({ name: 'profissionalId' })
  profissional: Promise<Profissional>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorServico: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valorDeslocamento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valorMateriais: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorTotal: number;

  @Column({ type: 'text' })
  descricaoDetalhada: string;

  @Column()
  prazoExecucao: string; // "2-3 horas", "1 dia", etc

  @Column({ type: 'timestamp', nullable: true })
  validadeAte: Date;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: OrcamentoStatus.ENVIADO 
  })
  status: OrcamentoStatus;

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @Column({ type: 'text', nullable: true })
  motivoRecusa?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @Column({ type: 'timestamp', nullable: true })
  aprovadoEm?: Date;
}
