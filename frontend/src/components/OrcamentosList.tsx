import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Orcamento } from '../types/orcamento';
import { orcamentoService } from '../services/orcamentoService';
import { useToast } from './Toast';

interface OrcamentosListProps {
  chamadoId: string;
  onAprovar?: () => void;
}

export function OrcamentosList({ chamadoId, onAprovar }: OrcamentosListProps) {
  const navigate = useNavigate();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadOrcamentos = async () => {
    try {
      setLoading(true);
      const data = await orcamentoService.listarPorChamado(chamadoId);
      setOrcamentos(data);
    } catch (error) {
      addToast('error', 'Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    loadOrcamentos();
  });

  const handleAprovar = async (orcamentoId: string) => {
    if (!confirm('Aprovar este orçamento? Os demais serão automaticamente recusados.')) {
      return;
    }

    try {
      await orcamentoService.aprovar(orcamentoId);
      addToast('success', 'Orçamento aprovado com sucesso!');
      loadOrcamentos();
      onAprovar?.();
    } catch (error: any) {
      addToast('error', error.response?.data?.message || 'Erro ao aprovar orçamento');
    }
  };

  const handleRecusar = async (orcamentoId: string) => {
    const motivo = prompt('Por que está recusando este orçamento? (opcional)');
    
    try {
      await orcamentoService.recusar(orcamentoId, motivo || undefined);
      addToast('info', 'Orçamento recusado');
      loadOrcamentos();
    } catch (error: any) {
      addToast('error', error.response?.data?.message || 'Erro ao recusar orçamento');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ENVIADO: 'bg-blue-100 text-blue-800',
      APROVADO: 'bg-green-100 text-green-800',
      RECUSADO: 'bg-red-100 text-red-800',
      EXPIRADO: 'bg-gray-100 text-gray-800',
      CANCELADO: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Carregando orçamentos...</p>
      </div>
    );
  }

  if (orcamentos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">Nenhum orçamento recebido ainda.</p>
        <p className="text-sm text-gray-500 mt-2">
          Profissionais enviarão orçamentos nas próximas 24 horas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">
        Orçamentos Recebidos ({orcamentos.length})
      </h3>

      {orcamentos.map((orc) => (
        <div
          key={orc.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-lg text-gray-900">
                {orc.profissionalNome || 'Profissional'}
              </h4>
              {orc.profissionalScore && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-semibold">{Number(orc.profissionalScore).toFixed(1)}</span>
                </div>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(orc.status)}`}>
              {orc.status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Serviço:</span>
              <span className="font-semibold">R$ {Number(orc.valorServico).toFixed(2)}</span>
            </div>
            {orc.valorDeslocamento > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Deslocamento:</span>
                <span className="font-semibold">R$ {Number(orc.valorDeslocamento).toFixed(2)}</span>
              </div>
            )}
            {orc.valorMateriais > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Materiais:</span>
                <span className="font-semibold">R$ {Number(orc.valorMateriais).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold text-gray-900">TOTAL:</span>
              <span className="font-bold text-2xl text-blue-600">
                R$ {Number(orc.valorTotal).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{orc.descricaoDetalhada}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-semibold">Prazo:</span> {orc.prazoExecucao}
            </div>
            <div>
              <span className="font-semibold">Válido até:</span>{' '}
              {new Date(orc.validadeAte).toLocaleDateString()}
            </div>
          </div>

          {orc.observacoes && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <p className="text-sm text-blue-900">{orc.observacoes}</p>
            </div>
          )}

          {orc.motivoRecusa && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-sm text-red-900">
                <strong>Motivo da recusa:</strong> {orc.motivoRecusa}
              </p>
            </div>
          )}

          {orc.status === 'ENVIADO' && (
            <div className="flex gap-3">
              <button
                onClick={() => handleAprovar(orc.id)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                ✓ Aprovar Orçamento
              </button>
              <button
                onClick={() => handleRecusar(orc.id)}
                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold"
              >
                ✕ Recusar
              </button>
            </div>
          )}

          {orc.status === 'APROVADO' && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-800 font-semibold text-center">
                ✓ Orçamento aprovado em {new Date(orc.aprovadoEm!).toLocaleString()}
              </p>
              <button
                onClick={() => navigate(`/checkout/${orc.id}`)}
                className="w-full mt-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                💳 Prosseguir para Pagamento
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
