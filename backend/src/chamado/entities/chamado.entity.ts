import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChamadoHistorico } from './chamado-historico.entity';
import { ChamadoFoto } from './chamado-foto.entity';
import { User } from '../../auth/entities/user.entity';

export enum ChamadoStatus {
  ABERTO = 'ABERTO',
  TRIADO = 'TRIADO',
  AGENDADO = 'AGENDADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

@Entity({ name: 'chamados' })
export class Chamado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @Column({ name: 'contexto' })
  contexto: string; // Casa, Vida Digital, Familia, Idosos, Transicoes

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'varchar', length: 50, default: ChamadoStatus.ABERTO })
  status: ChamadoStatus;

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @Column({ type: 'text', nullable: true })
  metadados?: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  endereco?: string;

  @Column({ type: 'varchar', nullable: true })
  cidade?: string;

  @Column({ type: 'varchar', nullable: true })
  estado?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  // Alias para compatibilidade
  get createdAt(): Date {
    return this.criadoEm;
  }

  get updatedAt(): Date {
    return this.atualizadoEm;
  }

  // Relations
  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'usuario_id' })
  cliente?: Promise<User>;

  @OneToMany(
    () => ChamadoHistorico,
    (historico) => historico.chamado,
    { cascade: true, eager: false },
  )
  historico?: ChamadoHistorico[];

  @OneToMany(
    () => ChamadoFoto,
    (foto) => foto.chamado,
    { cascade: true, eager: false },
  )
  fotos?: ChamadoFoto[];
}
