import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Chamado } from './chamado.entity';

@Entity('chamado_fotos')
export class ChamadoFoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chamadoId: string;

  @ManyToOne(() => Chamado, (chamado) => chamado.fotos, { onDelete: 'CASCADE' })
  chamado: Chamado;

  @Column()
  filename: string;

  @Column()
  url: string;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  size: number;

  @CreateDateColumn()
  createdAt: Date;
}
