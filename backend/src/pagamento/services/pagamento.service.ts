import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento, StatusPagamento, MetodoPagamento } from '../entities/pagamento.entity';
import { Orcamento } from '../../orcamento/entities/orcamento.entity';
import { CriarPagamentoDto } from '../dtos/pagamento.dto';
// import MercadoPago from 'mercadopago'; // Será implementado após instalação

@Injectable()
export class PagamentoService {
  constructor(
    @InjectRepository(Pagamento)
    private pagamentoRepository: Repository<Pagamento>,
    @InjectRepository(Orcamento)
    private orcamentoRepository: Repository<Orcamento>,
  ) {}

  /**
   * Inicia um novo pagamento para um orçamento aprovado
   */
  async iniciarPagamento(dto: CriarPagamentoDto): Promise<Pagamento> {
    // 1. Verificar se orçamento existe e está aprovado
    const orcamento = await this.orcamentoRepository.findOne({
      where: { id: dto.orcamentoId },
      relations: ['profissional'],
    });

    if (!orcamento) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    if (orcamento.status !== 'APROVADO') {
      throw new BadRequestException('Orçamento não está aprovado');
    }

    // 2. Verificar se já existe pagamento para este orçamento
    const pagamentoExistente = await this.pagamentoRepository.findOne({
      where: { orcamentoId: dto.orcamentoId },
    });

    if (pagamentoExistente && pagamentoExistente.status === StatusPagamento.APROVADO) {
      throw new BadRequestException('Orçamento já possui pagamento aprovado');
    }

    // 3. Calcular valores (12% de comissão)
    const valorTotal = Number(orcamento.valorTotal);
    const valorPlataforma = Number((valorTotal * 0.12).toFixed(2));
    const valorProfissional = Number((valorTotal - valorPlataforma).toFixed(2));

    // 4. Criar registro de pagamento
    const pagamento = this.pagamentoRepository.create({
      orcamentoId: dto.orcamentoId,
      profissionalId: Number(orcamento.profissionalId),
      valorTotal,
      valorProfissional,
      valorPlataforma,
      metodoPagamento: dto.metodoPagamento,
      status: StatusPagamento.PENDENTE,
    });

    // 5. Se for PIX, gerar QR Code (mock por enquanto)
    if (dto.metodoPagamento === MetodoPagamento.PIX) {
      const dataExpiracao = new Date();
      dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 30); // PIX expira em 30 min

      pagamento.dataExpiracao = dataExpiracao;
      
      // TODO: Integrar Mercado Pago para gerar QR Code real
      // Por enquanto, mock para desenvolvimento
      pagamento.pixQrCodeData = this.gerarPixMock(valorTotal);
      pagamento.pixQrCode = Buffer.from(pagamento.pixQrCodeData).toString('base64');
    }

    // 6. Se for cartão, gerar link de checkout (mock por enquanto)
    if (dto.metodoPagamento === MetodoPagamento.CREDITO || dto.metodoPagamento === MetodoPagamento.DEBITO) {
      // TODO: Integrar Mercado Pago para gerar link real
      pagamento.linkPagamento = `https://checkout.mercadopago.com.br/mock/${pagamento.id}`;
    }

    await this.pagamentoRepository.save(pagamento);
    return pagamento;
  }

  /**
   * Busca pagamento por ID
   */
  async obterPorId(id: number): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { id },
      relations: ['orcamento', 'profissional'],
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  /**
   * Busca pagamento por orçamento
   */
  async obterPorOrcamento(orcamentoId: string): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findOne({
      where: { orcamentoId },
      relations: ['orcamento', 'profissional'],
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado para este orçamento');
    }

    return pagamento;
  }

  /**
   * Lista todos os pagamentos de um profissional
   */
  async listarPorProfissional(profissionalId: number): Promise<Pagamento[]> {
    return this.pagamentoRepository.find({
      where: { profissionalId },
      relations: ['orcamento'],
      order: { criadoEm: 'DESC' },
    });
  }

  /**
   * Confirma pagamento (chamado pelo webhook ou manualmente)
   */
  async confirmarPagamento(id: number, mercadoPagoId?: string, mercadoPagoStatus?: string): Promise<Pagamento> {
    const pagamento = await this.obterPorId(id);

    if (pagamento.status === StatusPagamento.APROVADO) {
      throw new BadRequestException('Pagamento já confirmado');
    }

    pagamento.status = StatusPagamento.APROVADO;
    pagamento.dataAprovacao = new Date();
    
    if (mercadoPagoId) {
      pagamento.mercadoPagoId = mercadoPagoId;
    }
    
    if (mercadoPagoStatus) {
      pagamento.mercadoPagoStatus = mercadoPagoStatus;
    }

    // TODO: Ao confirmar pagamento, disparar:
    // - Atualizar status do orçamento
    // - Criar agendamento
    // - Enviar email para profissional
    // - Enviar email para cliente

    return this.pagamentoRepository.save(pagamento);
  }

  /**
   * Cancela pagamento
   */
  async cancelarPagamento(id: number, motivo: string): Promise<Pagamento> {
    const pagamento = await this.obterPorId(id);

    if (pagamento.status === StatusPagamento.APROVADO) {
      throw new BadRequestException('Não é possível cancelar pagamento aprovado. Use estorno.');
    }

    pagamento.status = StatusPagamento.CANCELADO;
    pagamento.dataCancelamento = new Date();
    pagamento.motivoCancelamento = motivo;

    return this.pagamentoRepository.save(pagamento);
  }

  /**
   * Estorna pagamento (reembolso)
   */
  async estornarPagamento(id: number, motivo: string): Promise<Pagamento> {
    const pagamento = await this.obterPorId(id);

    if (pagamento.status !== StatusPagamento.APROVADO) {
      throw new BadRequestException('Apenas pagamentos aprovados podem ser estornados');
    }

    // TODO: Integrar API de estorno do Mercado Pago

    pagamento.status = StatusPagamento.ESTORNADO;
    pagamento.motivoCancelamento = motivo;

    return this.pagamentoRepository.save(pagamento);
  }

  /**
   * Processa webhook do Mercado Pago
   */
  async processarWebhook(data: any): Promise<void> {
    console.log('Webhook recebido:', data);

    // TODO: Implementar lógica real do webhook
    // 1. Validar assinatura do webhook
    // 2. Buscar pagamento pelo mercadoPagoId
    // 3. Atualizar status conforme retorno do MP
    // 4. Se aprovado, chamar confirmarPagamento()

    if (data.type === 'payment') {
      const mercadoPagoId = data.data?.id;
      
      if (mercadoPagoId) {
        // Buscar pagamento
        const pagamento = await this.pagamentoRepository.findOne({
          where: { mercadoPagoId: mercadoPagoId.toString() },
        });

        if (pagamento) {
          // Atualizar status baseado no webhook
          if (data.action === 'payment.updated') {
            // TODO: Consultar API do MP para obter status atual
            // await this.confirmarPagamento(pagamento.id, mercadoPagoId, 'approved');
          }
        }
      }
    }
  }

  /**
   * Gera string PIX mock para desenvolvimento
   */
  private gerarPixMock(valor: number): string {
    return `00020126330014BR.GOV.BCB.PIX0111${Math.random().toString(36).substring(7)}520400005303986540${valor.toFixed(2)}5802BR5913VITAS SERVICOS6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
}
