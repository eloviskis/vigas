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
import { Profissional } from '../../profissional/entities/profissional.entity';

@Index('idx_slot_profissional_data', ['profissionalId', 'dataHora'])
@Index('idx_slot_disponivel', ['disponivel'])
@Entity({ name: 'slots' })
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'profissional_id' })
  profissionalId: string;

  @Column({ type: 'timestamp' })
  dataHora: Date;

  @Column({ type: 'integer', default: 60 })
  duracao: number; // minutos

  @Column({ default: true })
  disponivel: boolean;

  @Column({ nullable: true, name: 'agendamento_id' })
  agendamentoId?: string; // FK para Agendamento (quando slot está ocupado)

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  // Relations
  @ManyToOne(() => Profissional, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'profissional_id' })
  profissional?: Profissional;
}
