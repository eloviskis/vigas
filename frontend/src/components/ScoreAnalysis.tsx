import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ScoreDetail {
  profissional: {
    id: string;
    nome: string;
  };
  scoreBase: number;
  scoreHistorico: number;
  scoreSazonalidade: number;
  penalidades: number;
  scoreFinal: number;
  detalhes: {
    mediaAvaliacoes: number;
    totalAvaliacoes: number;
    taxaAceitacao: number;
    diasUltimoServico: number;
  };
}

export const ScoreAnalysis: React.FC<{ chamadoId: string }> = ({ chamadoId }) => {
  const [scores, setScores] = useState<ScoreDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, [chamadoId]);

  const loadScores = async () => {
    try {
      const response = await axios.get(`/api/triagem/${chamadoId}/scores`);
      setScores(response.data);
    } catch (err) {
      console.error('Erro ao carregar scores:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Analisando profissionais...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-bold text-lg mb-4">Análise de Score - Profissionais</h3>
      
      <div className="space-y-4">
        {scores.map((score, idx) => (
          <div key={score.profissional.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-lg">
                  {idx + 1}. {score.profissional.nome}
                </div>
                <div className="text-sm text-gray-600">
                  {score.detalhes.totalAvaliacoes} avaliações • 
                  Média {score.detalhes.mediaAvaliacoes.toFixed(1)}⭐
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {score.scoreFinal.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500">Score Final</div>
              </div>
            </div>

            {/* Breakdown de Scores */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">Base</div>
                <div className="text-lg font-semibold text-green-600">
                  {score.scoreBase.toFixed(0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">Histórico</div>
                <div className="text-lg font-semibold text-blue-600">
                  {score.scoreHistorico.toFixed(0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">Sazonalidade</div>
                <div className="text-lg font-semibold text-purple-600">
                  {score.scoreSazonalidade.toFixed(0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">Penalidades</div>
                <div className="text-lg font-semibold text-red-600">
                  -{score.penalidades.toFixed(0)}
                </div>
              </div>
            </div>

            {/* Barras de Progresso */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Compatibilidade</span>
                  <span>{score.scoreBase.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${score.scoreBase}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Experiência</span>
                  <span>{score.scoreHistorico.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${score.scoreHistorico}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Disponibilidade</span>
                  <span>{score.scoreSazonalidade.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${score.scoreSazonalidade}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Métricas Adicionais */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
              <div className="text-xs">
                <div className="text-gray-600">Taxa Aceitação</div>
                <div className="font-semibold">
                  {(score.detalhes.taxaAceitacao * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-xs">
                <div className="text-gray-600">Último Serviço</div>
                <div className="font-semibold">
                  {score.detalhes.diasUltimoServico} dias atrás
                </div>
              </div>
              <div className="text-xs">
                <div className="text-gray-600">Avaliações</div>
                <div className="font-semibold">
                  {score.detalhes.totalAvaliacoes} total
                </div>
              </div>
            </div>

            {idx === 0 && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded p-2 text-sm text-green-800">
                ✓ Profissional recomendado
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreAnalysis;
