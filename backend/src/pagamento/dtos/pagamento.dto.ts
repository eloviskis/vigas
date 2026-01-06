import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, Min } from 'class-validator';
import { MetodoPagamento } from '../entities/pagamento.entity';

export class CriarPagamentoDto {
  @IsNotEmpty()
  @IsString()
  orcamentoId: string;

  @IsNotEmpty()
  @IsEnum(MetodoPagamento)
  metodoPagamento: MetodoPagamento;

  @IsOptional()
  @IsString()
  email?: string; // Para notificações do Mercado Pago

  @IsOptional()
  @IsString()
  cpf?: string; // Opcional para PIX
}

export class PagamentoResponseDto {
  id: number;
  orcamentoId: string;
  valorTotal: number;
  valorProfissional: number;
  valorPlataforma: number;
  status: string;
  metodoPagamento: string;
  pixQrCode?: string;
  pixQrCodeData?: string;
  linkPagamento?: string;
  dataExpiracao?: Date;
  criadoEm: Date;
}

export class WebhookMercadoPagoDto {
  @IsOptional()
  action?: string;

  @IsOptional()
  @IsString()
  api_version?: string;

  @IsOptional()
  data?: {
    id: string;
  };

  @IsOptional()
  @IsString()
  date_created?: string;

  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  live_mode?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}

export class CancelarPagamentoDto {
  @IsNotEmpty()
  @IsString()
  motivo: string;
}
