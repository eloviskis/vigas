import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChamadoList } from '../pages/ChamadoList';
import * as chamadoService from '../services/chamadoService';

vi.mock('../services/chamadoService');

describe('ChamadoList Component', () => {
  const mockChamados = [
    {
      id: '1',
      titulo: 'Conserto de torneira',
      descricao: 'Vazamento',
      status: 'ABERTO',
      criadoEm: new Date(),
    },
    {
      id: '2',
      titulo: 'Instalação de prateleira',
      descricao: 'Sala',
      status: 'TRIADO',
      criadoEm: new Date(),
    },
  ];

  beforeEach(() => {
    vi.mocked(chamadoService.listar).mockResolvedValue(mockChamados);
  });

  it('deve renderizar lista de chamados', async () => {
    render(<ChamadoList />);

    await waitFor(() => {
      expect(screen.getByText('Conserto de torneira')).toBeInTheDocument();
      expect(screen.getByText('Instalação de prateleira')).toBeInTheDocument();
    });
  });

  it('deve filtrar chamados por status', async () => {
    render(<ChamadoList />);

    const filterSelect = screen.getByDisplayValue('Todos os status');
    fireEvent.change(filterSelect, { target: { value: 'ABERTO' } });

    await waitFor(() => {
      expect(chamadoService.listar).toHaveBeenCalledWith({ status: 'ABERTO' });
    });
  });

  it('deve abrir detalhe ao clicar em chamado', async () => {
    render(<ChamadoList />);

    await waitFor(() => {
      const item = screen.getByText('Conserto de torneira');
      fireEvent.click(item);
      expect(screen.getByText(/Detalhes do Chamado/i)).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando lista vazia', async () => {
    vi.mocked(chamadoService.listar).mockResolvedValue([]);
    render(<ChamadoList />);

    await waitFor(() => {
      expect(
        screen.getByText(/Nenhum chamado encontrado/i)
      ).toBeInTheDocument();
    });
  });
});
