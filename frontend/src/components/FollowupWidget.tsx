import React, { useEffect, useState } from 'react';
import { followupService } from '../services/followupService';

interface FollowupItem {
  id: string;
  tipo: 'CONFIRMACAO' | 'LEMBRANCA' | 'FEEDBACK' | 'RESOLUCAO';
  status: 'PENDENTE' | 'ENVIADO' | 'RESPONDIDO' | 'EXPIRADO';
  mensagem: string;
  avaliacaoGeral?: number;
  resposta?: string;
  dataEnvio?: Date;
  dataResposta?: Date;
}

interface FollowupWidgetProps {
  agendamentoId: string;
}

/**
 * Widget de Followup para chamados
 * Exibe status de confirmações, lembretes e feedbacks
 */
export const FollowupWidget: React.FC<FollowupWidgetProps> = ({
  agendamentoId,
}) => {
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFollowup, setSelectedFollowup] = useState<FollowupItem | null>(
    null
  );
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState('');

  useEffect(() => {
    loadFollowups();
  }, [agendamentoId]);

  const loadFollowups = async () => {
    try {
      setLoading(true);
      const data = await followupService.listarPorAgendamento(agendamentoId);
      setFollowups(data);
    } catch (error) {
      console.error('Erro ao carregar followups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (followupId: string) => {
    if (rating === 0) {
      alert('Por favor, dê uma avaliação');
      return;
    }

    try {
      await followupService.responder(followupId, {
        resposta: 'Respondido',
        avaliacaoGeral: rating,
        comentarios: comments,
      });

      setSelectedFollowup(null);
      setRating(0);
      setComments('');
      loadFollowups();
    } catch (error) {
      console.error('Erro ao responder:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDENTE: 'bg-yellow-100 text-yellow-800',
      ENVIADO: 'bg-blue-100 text-blue-800',
      RESPONDIDO: 'bg-green-100 text-green-800',
      EXPIRADO: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || styles.PENDENTE;
  };

  const getTypoBadge = (tipo: string) => {
    const labels: Record<string, string> = {
      CONFIRMACAO: '✓ Confirmação',
      LEMBRANCA: '🔔 Lembrete',
      FEEDBACK: '⭐ Feedback',
      RESOLUCAO: '📋 Resolução',
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando seguimentos...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-4">📞 Seguimentos</h3>

      {followups.length === 0 ? (
        <p className="text-gray-500">Nenhum seguimento pendente</p>
      ) : (
        <div className="space-y-3">
          {followups.map((f) => (
            <div
              key={f.id}
              className="border rounded p-3 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    {getTypoBadge(f.tipo)}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{f.mensagem}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(f.status)}`}>
                  {f.status}
                </span>
              </div>

              {f.status === 'RESPONDIDO' && f.avaliacaoGeral && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= f.avaliacaoGeral! ? '⭐' : '☆'}
                      >
                        {star <= f.avaliacaoGeral! ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  {f.resposta && (
                    <p className="text-xs text-gray-500 mt-1">{f.resposta}</p>
                  )}
                </div>
              )}

              {f.status === 'ENVIADO' && (
                <button
                  onClick={() => setSelectedFollowup(f)}
                  className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Responder
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Resposta */}
      {selectedFollowup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h4 className="font-bold text-lg mb-4">
              {getTypoBadge(selectedFollowup.tipo)}
            </h4>
            <p className="text-gray-700 mb-4">{selectedFollowup.mensagem}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Sua avaliação
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? '⭐' : '☆'}`}
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Comentários (opcional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                rows={3}
                placeholder="Deixe seus comentários..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedFollowup(null);
                  setRating(0);
                  setComments('');
                }}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRespond(selectedFollowup.id)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupWidget;
