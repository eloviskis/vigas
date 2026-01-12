import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Orcamento } from '../../orcamento/entities/orcamento.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';

export enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
  CANCELADO = 'CANCELADO',
  ESTORNADO = 'ESTORNADO',
}

export enum MetodoPagamento {
  PIX = 'PIX',
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
  BOLETO = 'BOLETO',
}

@Entity('pagamentos')
export class Pagamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Orcamento)
  @JoinColumn({ name: 'orcamentoId' })
  orcamento: Orcamento;

  @Column()
  orcamentoId: string;

  @ManyToOne(() => Profissional)
  @JoinColumn({ name: 'profissionalId' })
  profissional: Profissional;

  @Column()
  profissionalId: number;

  // Valores
  @Column('decimal', { precision: 10, scale: 2 })
  valorTotal: number;

  // Alias para compatibilidade
  get valor(): number {
    return this.valorTotal;
  }

  @Column('decimal', { precision: 10, scale: 2 })
  valorProfissional: number; // 88%

  @Column('decimal', { precision: 10, scale: 2 })
  valorPlataforma: number; // 12%

  // Status e método
  @Column({
    type: 'varchar',
    default: StatusPagamento.PENDENTE,
  })
  status: StatusPagamento;

  @Column({
    type: 'varchar',
  })
  metodoPagamento: MetodoPagamento;

  // Integração Mercado Pago
  @Column({ nullable: true })
  mercadoPagoId: string; // ID da preferência ou pagamento

  @Column({ nullable: true })
  mercadoPagoStatus: string; // status retornado pelo MP

  // PIX específico
  @Column({ nullable: true })
  pixQrCode: string; // base64 do QR Code

  @Column({ nullable: true })
  pixQrCodeData: string; // string para copiar/colar

  @Column({ nullable: true })
  pixChave: string;

  // Dados do pagamento
  @Column({ type: 'text', nullable: true })
  dadosTransacao: string; // JSON com resposta completa do gateway

  @Column({ nullable: true })
  linkPagamento: string; // URL para checkout externo (se necessário)

  // Controle
  @Column({ type: 'timestamp', nullable: true })
  dataExpiracao: Date; // PIX expira em 30 minutos

  @Column({ type: 'timestamp', nullable: true })
  dataAprovacao: Date;

  @Column({ type: 'timestamp', nullable: true })
  dataCancelamento: Date;

  @Column({ nullable: true })
  motivoCancelamento: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  // Alias para compatibilidade
  get createdAt(): Date {
    return this.criadoEm;
  }
}
