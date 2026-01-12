import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profissional } from '../../profissional/entities/profissional.entity';

@Entity({ name: 'score_historico' })
export class ScoreHistorico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profissionalId: string;

  @ManyToOne(() => Profissional)
  @JoinColumn({ name: 'profissionalId' })
  profissional: Profissional;

  @Column({ type: 'float' })
  scoreBase: number;

  @Column({ type: 'float' })
  scoreHistorico: number;

  @Column({ type: 'float' })
  scoreSazonalidade: number;

  @Column({ type: 'float' })
  penalidades: number;

  @Column({ type: 'float' })
  scoreFinal: number;

  @Column({ type: 'varchar' })
  categoria: string;

  @Column({ type: 'simple-json', nullable: true })
  detalhes: any;

  @CreateDateColumn()
  criadoEm: Date;
}
