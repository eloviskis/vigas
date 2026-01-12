import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const DashboardFinanceiro: React.FC = () => {
  const [resumo, setResumo] = useState<any>(null);
  const [metricas, setMetricas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState({ inicio: '', fim: '' });

  useEffect(() => {
    const hoje = new Date();
    const mesPassado = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
    setPeriodo({
      inicio: mesPassado.toISOString().split('T')[0],
      fim: hoje.toISOString().split('T')[0],
    });
  }, []);

  useEffect(() => {
    if (periodo.inicio && periodo.fim) {
      loadDados();
    }
  }, [periodo]);

  const loadDados = async () => {
    try {
      setLoading(true);
      const [resumoRes, metricasRes] = await Promise.all([
        axios.get(`/api/relatorios-financeiros/resumo?dataInicio=${periodo.inicio}&dataFim=${periodo.fim}`),
        axios.get(`/api/relatorios-financeiros/diarias?dataInicio=${periodo.inicio}&dataFim=${periodo.fim}`),
      ]);
      setResumo(resumoRes.data);
      setMetricas(metricasRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !resumo) return <div>Carregando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Financeiro</h1>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Data Início</label>
          <input
            type="date"
            value={periodo.inicio}
            onChange={(e) => setPeriodo({ ...periodo, inicio: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Fim</label>
          <input
            type="date"
            value={periodo.fim}
            onChange={(e) => setPeriodo({ ...periodo, fim: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Total Bruto</div>
          <div className="text-2xl font-bold text-green-600">
            R$ {resumo.resumo.valorBruto.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">{resumo.resumo.totalTransacoes} transações</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Comissão Plataforma</div>
          <div className="text-2xl font-bold text-blue-600">
            R$ {resumo.resumo.comissaoPlataforma.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">
            {((resumo.resumo.comissaoPlataforma / resumo.resumo.valorBruto) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Valor Líquido</div>
          <div className="text-2xl font-bold text-purple-600">
            R$ {resumo.resumo.valorLiquido.toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-600 text-sm">Repasses Profissionais</div>
          <div className="text-2xl font-bold text-orange-600">
            R$ {resumo.resumo.valorRepasses.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Gráfico Simples de Métricas Diárias */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">Transações Diárias</h2>
        <div className="h-64 flex items-end gap-2">
          {metricas.map((m, i) => {
            const maxValor = Math.max(...metricas.map(x => x.total));
            const altura = (m.total / maxValor) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">
                  R$ {m.total.toFixed(0)}
                </div>
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${altura}%` }}
                  title={`${m.data}: R$ ${m.total.toFixed(2)}`}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(m.data).getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Profissionais */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-4">Top 10 Profissionais</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Profissional</th>
              <th className="text-right py-2">Transações</th>
              <th className="text-right py-2">Total Recebido</th>
            </tr>
          </thead>
          <tbody>
            {resumo.topProfissionais.map((prof: any, i: number) => (
              <tr key={prof.id} className="border-b hover:bg-gray-50">
                <td className="py-2">
                  <div className="font-medium">{prof.nome}</div>
                </td>
                <td className="text-right">{prof.totalTransacoes}</td>
                <td className="text-right text-green-600 font-semibold">
                  R$ {prof.totalRecebido.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Métodos de Pagamento */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="font-semibold mb-4">Por Método de Pagamento</h2>
        <div className="space-y-3">
          {Object.entries(resumo.porMetodo).map(([metodo, valor]: [string, any]) => {
            const percentual = (valor / resumo.resumo.valorBruto) * 100;
            return (
              <div key={metodo}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{metodo}</span>
                  <span>R$ {valor.toFixed(2)} ({percentual.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardFinanceiro;
