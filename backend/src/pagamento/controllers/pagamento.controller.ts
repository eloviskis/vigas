import { 
  Controller, 
  Post, 
  Get, 
  Patch,
  Body, 
  Param, 
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PagamentoService } from '../services/pagamento.service';
import { 
  CriarPagamentoDto, 
  PagamentoResponseDto,
  WebhookMercadoPagoDto,
  CancelarPagamentoDto,
} from '../dtos/pagamento.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  /**
   * POST /api/pagamentos
   * Inicia um pagamento para um orçamento aprovado
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async criar(@Body() dto: CriarPagamentoDto): Promise<PagamentoResponseDto> {
    const pagamento = await this.pagamentoService.iniciarPagamento(dto);
    
    return {
      id: pagamento.id,
      orcamentoId: pagamento.orcamentoId,
      valorTotal: Number(pagamento.valorTotal),
      valorProfissional: Number(pagamento.valorProfissional),
      valorPlataforma: Number(pagamento.valorPlataforma),
      status: pagamento.status,
      metodoPagamento: pagamento.metodoPagamento,
      pixQrCode: pagamento.pixQrCode,
      pixQrCodeData: pagamento.pixQrCodeData,
      linkPagamento: pagamento.linkPagamento,
      dataExpiracao: pagamento.dataExpiracao,
      criadoEm: pagamento.criadoEm,
    };
  }

  /**
   * GET /api/pagamentos/:id
   * Busca um pagamento específico
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async obterPorId(@Param('id') id: number): Promise<PagamentoResponseDto> {
    const pagamento = await this.pagamentoService.obterPorId(id);
    
    return {
      id: pagamento.id,
      orcamentoId: pagamento.orcamentoId,
      valorTotal: Number(pagamento.valorTotal),
      valorProfissional: Number(pagamento.valorProfissional),
      valorPlataforma: Number(pagamento.valorPlataforma),
      status: pagamento.status,
      metodoPagamento: pagamento.metodoPagamento,
      pixQrCode: pagamento.pixQrCode,
      pixQrCodeData: pagamento.pixQrCodeData,
      linkPagamento: pagamento.linkPagamento,
      dataExpiracao: pagamento.dataExpiracao,
      criadoEm: pagamento.criadoEm,
    };
  }

  /**
   * GET /api/pagamentos/orcamento/:orcamentoId
   * Busca pagamento por orçamento
   */
  @Get('orcamento/:orcamentoId')
  @UseGuards(JwtAuthGuard)
  async obterPorOrcamento(@Param('orcamentoId') orcamentoId: string): Promise<PagamentoResponseDto> {
    const pagamento = await this.pagamentoService.obterPorOrcamento(orcamentoId);
    
    return {
      id: pagamento.id,
      orcamentoId: pagamento.orcamentoId,
      valorTotal: Number(pagamento.valorTotal),
      valorProfissional: Number(pagamento.valorProfissional),
      valorPlataforma: Number(pagamento.valorPlataforma),
      status: pagamento.status,
      metodoPagamento: pagamento.metodoPagamento,
      pixQrCode: pagamento.pixQrCode,
      pixQrCodeData: pagamento.pixQrCodeData,
      linkPagamento: pagamento.linkPagamento,
      dataExpiracao: pagamento.dataExpiracao,
      criadoEm: pagamento.criadoEm,
    };
  }

  /**
   * GET /api/pagamentos/profissional/:profissionalId
   * Lista todos os pagamentos de um profissional
   */
  @Get('profissional/:profissionalId')
  @UseGuards(JwtAuthGuard)
  async listarPorProfissional(@Param('profissionalId') profissionalId: number) {
    return this.pagamentoService.listarPorProfissional(profissionalId);
  }

  /**
   * PATCH /api/pagamentos/:id/confirmar
   * Confirma um pagamento manualmente (para testes)
   */
  @Patch(':id/confirmar')
  @UseGuards(JwtAuthGuard)
  async confirmar(@Param('id') id: number) {
    return this.pagamentoService.confirmarPagamento(id);
  }

  /**
   * PATCH /api/pagamentos/:id/cancelar
   * Cancela um pagamento pendente
   */
  @Patch(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  async cancelar(
    @Param('id') id: number,
    @Body() dto: CancelarPagamentoDto,
  ) {
    return this.pagamentoService.cancelarPagamento(id, dto.motivo);
  }

  /**
   * PATCH /api/pagamentos/:id/estornar
   * Estorna um pagamento aprovado (reembolso)
   */
  @Patch(':id/estornar')
  @UseGuards(JwtAuthGuard)
  async estornar(
    @Param('id') id: number,
    @Body() dto: CancelarPagamentoDto,
  ) {
    return this.pagamentoService.estornarPagamento(id, dto.motivo);
  }

  /**
   * POST /api/pagamentos/webhook
   * Recebe notificações do Mercado Pago
   * Não usa guard porque é chamado pelo MP
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() data: WebhookMercadoPagoDto) {
    await this.pagamentoService.processarWebhook(data);
    return { status: 'ok' };
  }
}
