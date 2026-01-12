import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Chamado } from '../../chamado/entities/chamado.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
import { User } from '../../auth/entities/user.entity';

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

  @ManyToOne(() => User, { lazy: true })
  @JoinColumn({ name: 'clienteId' })
  cliente?: Promise<User>;

  @Column({ type: 'integer' }) // 1-5
  notaGeral: number;

  // Alias para compatibilidade
  get nota(): number {
    return this.notaGeral;
  }

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

  // Alias para compatibilidade
  get createdAt(): Date {
    return this.criadoEm;
  }
}
