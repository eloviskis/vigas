import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';

@Entity({ name: 'avaliacoes' })
export class Avaliacao {
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

  @Column()
  clienteId: string;

  @Column({ type: 'integer' }) // 1-5
  notaGeral: number;

  @Column({ type: 'integer' }) // 1-5
  pontualidade: number;

  @Column({ type: 'integer' }) // 1-5
  qualidade: number;

  @Column({ type: 'integer' }) // 1-5
  comunicacao: number;

  @Column({ type: 'boolean', default: true })
  recomenda: boolean;

  @Column({ type: 'text', nullable: true })
  comentario?: string;

  @Column({ type: 'text', nullable: true })
  respostaProfissional?: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}
