import { Injectable, Logger } from '@nestjs/common';

interface PixPaymentRequest {
  transaction_amount: number;
  description: string;
  payer?: {
    email?: string;
    identification?: {
      type: string; // e.g., 'CPF'
      number: string;
    };
  };
}

interface PixPaymentResponse {
  id: string;
  status: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
    };
  };
}

interface CheckoutPreference {
  init_point?: string;
  sandbox_init_point?: string;
  id?: string;
}

interface MercadoPagoSdk {
  payment: {
    create(params: { body: Record<string, unknown> }): Promise<{ body: any }>;
    get(params: { id: string | number }): Promise<{ body: any }>;
    cancel?(params: { id: string | number }): Promise<{ body: any }>;
  };
  refund?: {
    create(params: { payment_id: string | number }): Promise<{ body: any }>;
  };
  preference?: {
    create(params: { body: Record<string, unknown> }): Promise<{ body: CheckoutPreference }>;
  };
}

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly sdk: MercadoPagoSdk | null = null;
  private readonly token: string | undefined;

  constructor() {
    this.token = process.env.MP_ACCESS_TOKEN;
    if (!this.token) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mercadopago = require('mercadopago') as {
        MercadoPago: new (config: { accessToken: string }) => MercadoPagoSdk;
      };
      this.sdk = new mercadopago.MercadoPago({
        accessToken: this.token,
      });
    } catch (err) {
      this.logger.error('Falha ao inicializar SDK Mercado Pago', err as Error);
      this.sdk = null;
    }
  }

  /**
   * Cria um pagamento PIX e retorna dados do QR Code
   */
  async criarPagamentoPix(req: PixPaymentRequest): Promise<PixPaymentResponse | null> {
    if (!this.sdk) {
      this.logger.warn('MP_ACCESS_TOKEN não configurado ou SDK indisponível');
      return null;
    }

    try {
      const response = await this.sdk.payment.create({
        body: {
          transaction_amount: req.transaction_amount,
          description: req.description,
          payment_method_id: 'pix',
          payer: req.payer,
        },
      });

      return response?.body ?? null;
    } catch (err) {
      this.logger.error('Erro ao criar pagamento PIX no Mercado Pago', err as Error);
      return null;
    }
  }

  /**
   * Obtém detalhes/status de um pagamento pelo ID do MP
   */
  async obterPagamento(id: string): Promise<PixPaymentResponse | null> {
    if (!this.sdk) return null;

    try {
      const response = await this.sdk.payment.get({ id });
      return response?.body ?? null;
    } catch (err) {
      this.logger.error(`Erro ao consultar pagamento MP id=${id}`, err as Error);
      return null;
    }
  }

  /**
   * Cria um checkout preference para cartão e retorna link de pagamento
   */
  async criarCheckoutLink(params: {
    title: string;
    amount: number;
    quantity?: number;
  }): Promise<string | null> {
    if (!this.sdk?.preference) return null;

    try {
      const response = await this.sdk.preference.create({
        body: {
          items: [
            {
              title: params.title,
              quantity: params.quantity ?? 1,
              unit_price: params.amount,
              currency_id: 'BRL',
            },
          ],
          payment_methods: {
            excluded_payment_types: [{ id: 'ticket' }],
          },
        },
      });

      return response?.body?.init_point || response?.body?.sandbox_init_point || null;
    } catch (err) {
      this.logger.error('Erro ao criar checkout no Mercado Pago', err as Error);
      return null;
    }
  }

  /**
   * Solicita estorno de um pagamento aprovado
   */
  async estornarPagamento(id: string | number): Promise<boolean> {
    if (!this.sdk?.refund) return false;
    try {
      await this.sdk.refund.create({ payment_id: id });
      return true;
    } catch (err) {
      this.logger.error(`Erro ao estornar pagamento MP id=${id}`, err as Error);
      return false;
    }
  }
}
