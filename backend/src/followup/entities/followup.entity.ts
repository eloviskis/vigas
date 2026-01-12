import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Agendamento } from '../../agendamento/entities/agendamento.entity';
import { Usuario } from '../../auth/entities/usuario.entity';

export enum FollowupTipo {
  CONFIRMACAO = 'CONFIRMACAO',
  LEMBRANCA = 'LEMBRANCA',
  FEEDBACK = 'FEEDBACK',
  RESOLUCAO = 'RESOLUCAO',
}

export enum FollowupStatus {
  PENDENTE = 'PENDENTE',
  ENVIADO = 'ENVIADO',
  RESPONDIDO = 'RESPONDIDO',
  EXPIRADO = 'EXPIRADO',
}

@Entity({ name: 'followups' })
export class Followup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agendamentoId: string;

  @ManyToOne(() => Agendamento, { nullable: true })
  @JoinColumn({ name: 'agendamentoId' })
  agendamento: Agendamento;

  @ManyToOne(() => Usuario, { nullable: true })
  usuario: Usuario;

  @Column({ type: 'varchar' })
  tipo: FollowupTipo;

  @Column({ type: 'varchar' })
  status: FollowupStatus;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ type: 'int', nullable: true })
  avaliacaoGeral?: number;

  @Column({ type: 'int', nullable: true })
  avaliacaoProfissional?: number;

  @Column({ type: 'text', nullable: true })
  resposta?: string;

  @Column({ type: 'text', nullable: true })
  comentarios?: string;

  @CreateDateColumn()
  criadoEm: Date;

  @Column({ type: 'datetime', nullable: true })
  dataEnvio?: Date;

  @Column({ type: 'datetime', nullable: true })
  dataResposta?: Date;
}
