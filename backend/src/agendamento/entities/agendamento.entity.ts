import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
import { Slot } from './slot.entity';

export enum AgendamentoStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
  NAOCOMPARECEU = 'NAOCOMPARECEU',
}

@Index('idx_agendamento_chamado', ['chamadoId'])
@Index('idx_agendamento_profissional', ['profissionalId'])
@Index('idx_agendamento_status', ['status'])
@Index('idx_agendamento_data', ['dataHora'])
@Entity({ name: 'agendamentos' })
export class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chamado_id' })
  chamadoId: string;

  @Column({ name: 'profissional_id' })
  profissionalId: string;

  @Column({ name: 'slot_id', nullable: true })
  slotId?: string;

  @Column({ type: 'timestamp' })
  dataHora: Date;

  @Column({ type: 'integer', default: 60 })
  duracao: number; // minutos

  @Column({ type: 'enum', enum: AgendamentoStatus, default: AgendamentoStatus.PENDENTE })
  status: AgendamentoStatus;

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @Column({ nullable: true })
  confirmadoEm?: Date;

  @Column({ nullable: true })
  canceladoEm?: Date;

  @Column({ type: 'text', nullable: true })
  motivoCancelamento?: string;

  @Column({ nullable: true })
  inicioAtendimento?: Date;

  @Column({ nullable: true })
  fimAtendimento?: Date;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  // Relations
  @ManyToOne(() => Chamado, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'chamado_id' })
  chamado?: Chamado;

  @ManyToOne(() => Profissional, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'profissional_id' })
  profissional?: Profissional;

  @ManyToOne(() => Slot, { onDelete: 'SET NULL', eager: false })
  @JoinColumn({ name: 'slot_id' })
  slot?: Slot;
}
