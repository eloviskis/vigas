import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Checkout } from '../pages/Checkout';
import * as pagamentoService from '../services/pagamentoService';

vi.mock('../services/pagamentoService');

describe('Checkout Component', () => {
  const mockOrcamento = {
    id: 'orc-123',
    valor: 150.0,
    descricao: 'Conserto de torneira',
    profissional: { nome: 'João' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(pagamentoService.obterOrcamento).mockResolvedValue(
      mockOrcamento
    );
  });

  it('deve renderizar dados do orçamento', async () => {
    render(<Checkout orcamentoId="orc-123" />);

    await waitFor(() => {
      expect(screen.getByText('Conserto de torneira')).toBeInTheDocument();
      expect(screen.getByText(/R\$ 150,00/)).toBeInTheDocument();
    });
  });

  it('deve exibir opções de pagamento (PIX e Cartão)', async () => {
    render(<Checkout orcamentoId="orc-123" />);

    await waitFor(() => {
      expect(screen.getByText(/PIX/)).toBeInTheDocument();
      expect(screen.getByText(/Cartão de Crédito/)).toBeInTheDocument();
    });
  });

  it('deve gerar QR Code ao selecionar PIX', async () => {
    render(<Checkout orcamentoId="orc-123" />);

    const pixButton = screen.getByText(/PIX/);
    fireEvent.click(pixButton);

    await waitFor(() => {
      expect(vi.mocked(pagamentoService.criarCheckoutPix)).toHaveBeenCalled();
    });
  });

  it('deve redirecionar para checkout do Mercado Pago para cartão', async () => {
    render(<Checkout orcamentoId="orc-123" />);

    const cardButton = screen.getByText(/Cartão de Crédito/);
    fireEvent.click(cardButton);

    await waitFor(() => {
      expect(
        vi.mocked(pagamentoService.criarCheckoutCartao)
      ).toHaveBeenCalled();
    });
  });

  it('deve exibir erro em caso de falha no pagamento', async () => {
    vi.mocked(pagamentoService.criarCheckoutPix).mockRejectedValue(
      new Error('Falha na API')
    );

    render(<Checkout orcamentoId="orc-123" />);
    fireEvent.click(screen.getByText(/PIX/));

    await waitFor(() => {
      expect(screen.getByText(/Erro ao processar/i)).toBeInTheDocument();
    });
  });
});
