import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ChamadoHistoricoTipo {
  STATUS = 'STATUS',
  TRIAGEM = 'TRIAGEM',
  AGENDAMENTO = 'AGENDAMENTO',
  NOTA = 'NOTA',
  SISTEMA = 'SISTEMA',
}

@Entity({ name: 'chamado_historico' })
export class ChamadoHistorico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chamado_id' })
  chamadoId: string;

  @Column({ type: 'enum', enum: ChamadoHistoricoTipo })
  tipo: ChamadoHistoricoTipo;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}
