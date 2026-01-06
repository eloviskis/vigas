import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
} from 'lucide-react';
import { BackButton } from '../../components/BackButton';
import { pagamentoService } from '../../services/pagamentoService';
import { orcamentoService } from '../../services/orcamentoService';
import { MetodoPagamento, StatusPagamento, PagamentoResponse } from '../../types/pagamento';
import { Orcamento } from '../../types/orcamento';
import './Checkout.css';

export const Checkout: React.FC = () => {
  const { orcamentoId } = useParams<{ orcamentoId: string }>();
  const navigate = useNavigate();

  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [pagamento, setPagamento] = useState<PagamentoResponse | null>(null);
  const [metodoSelecionado, setMetodoSelecionado] = useState<MetodoPagamento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixCopiado, setPixCopiado] = useState(false);
  const [verificandoPagamento, setVerificandoPagamento] = useState(false);

  useEffect(() => {
    carregarOrcamento();
  }, [orcamentoId]);

  useEffect(() => {
    if (pagamento?.status === StatusPagamento.PENDENTE) {
      // Poll a cada 5 segundos para verificar se pagamento foi aprovado
      const interval = setInterval(() => {
        verificarStatusPagamento();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [pagamento]);

  const carregarOrcamento = async () => {
    try {
      setLoading(true);
      const data = await orcamentoService.obterPorId(orcamentoId!);
      setOrcamento(data);

      // Verificar se já existe pagamento
      try {
        const pagamentoExistente = await pagamentoService.obterPorOrcamento(orcamentoId!);
        setPagamento(pagamentoExistente);
        setMetodoSelecionado(pagamentoExistente.metodoPagamento);
      } catch (err) {
        // Não existe pagamento ainda, ok
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const verificarStatusPagamento = async () => {
    if (!pagamento) return;

    try {
      setVerificandoPagamento(true);
      const atualizado = await pagamentoService.obterPorId(pagamento.id);
      setPagamento(atualizado);

      if (atualizado.status === StatusPagamento.APROVADO) {
        // Pagamento confirmado!
        setTimeout(() => {
          navigate('/chamados');
        }, 3000);
      }
    } catch (err) {
      console.error('Erro ao verificar pagamento:', err);
    } finally {
      setVerificandoPagamento(false);
    }
  };

  const iniciarPagamento = async () => {
    if (!metodoSelecionado || !orcamento) return;

    try {
      setLoading(true);
      setError('');

      const novoPagamento = await pagamentoService.criar({
        orcamentoId: orcamento.id,
        metodoPagamento: metodoSelecionado,
      });

      setPagamento(novoPagamento);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao iniciar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const copiarPixCodigo = () => {
    if (pagamento?.pixQrCodeData) {
      navigator.clipboard.writeText(pagamento.pixQrCodeData);
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 2000);
    }
  };

  const confirmarPagamentoManual = async () => {
    if (!pagamento) return;

    try {
      setLoading(true);
      await pagamentoService.confirmar(pagamento.id);
      await verificarStatusPagamento();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao confirmar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orcamento) {
    return (
      <div className="checkout-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (error && !orcamento) {
    return (
      <div className="checkout-container">
        <BackButton />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!orcamento) {
    return null;
  }

  return (
    <div className="checkout-container">
      <BackButton />
      
      <div className="checkout-header">
        <h1>💳 Pagamento</h1>
        <p>Complete o pagamento para confirmar o serviço</p>
      </div>

      {/* Resumo do Orçamento */}
      <div className="checkout-resumo">
        <h2>Resumo do Orçamento</h2>
        <div className="resumo-item">
          <span>Serviço:</span>
          <span>R$ {Number(orcamento.valorServico).toFixed(2)}</span>
        </div>
        <div className="resumo-item">
          <span>Deslocamento:</span>
          <span>R$ {Number(orcamento.valorDeslocamento).toFixed(2)}</span>
        </div>
        {orcamento.valorMateriais > 0 && (
          <div className="resumo-item">
            <span>Materiais:</span>
            <span>R$ {Number(orcamento.valorMateriais).toFixed(2)}</span>
          </div>
        )}
        <div className="resumo-total">
          <span>Total:</span>
          <span>R$ {Number(orcamento.valorTotal).toFixed(2)}</span>
        </div>
      </div>

      {/* Status do Pagamento */}
      {pagamento && (
        <div className={`pagamento-status pagamento-status-${pagamento.status.toLowerCase()}`}>
          {pagamento.status === StatusPagamento.PENDENTE && (
            <>
              <Clock className="status-icon" />
              <span>Aguardando pagamento...</span>
              {verificandoPagamento && <RefreshCw className="status-icon rotating" size={16} />}
            </>
          )}
          {pagamento.status === StatusPagamento.APROVADO && (
            <>
              <CheckCircle className="status-icon" />
              <span>Pagamento confirmado! ✅</span>
            </>
          )}
          {pagamento.status === StatusPagamento.RECUSADO && (
            <>
              <XCircle className="status-icon" />
              <span>Pagamento recusado</span>
            </>
          )}
        </div>
      )}

      {/* Seleção de Método de Pagamento */}
      {!pagamento && (
        <div className="metodos-pagamento">
          <h2>Escolha a forma de pagamento</h2>

          <div className="metodos-grid">
            <button
              className={`metodo-card ${metodoSelecionado === MetodoPagamento.PIX ? 'selected' : ''}`}
              onClick={() => setMetodoSelecionado(MetodoPagamento.PIX)}
            >
              <Smartphone size={32} />
              <span>PIX</span>
              <small>Aprovação instantânea</small>
            </button>

            <button
              className={`metodo-card ${metodoSelecionado === MetodoPagamento.CREDITO ? 'selected' : ''}`}
              onClick={() => setMetodoSelecionado(MetodoPagamento.CREDITO)}
              disabled
            >
              <CreditCard size={32} />
              <span>Cartão de Crédito</span>
              <small>Em breve</small>
            </button>
          </div>

          <button
            className="btn-pagar"
            onClick={iniciarPagamento}
            disabled={!metodoSelecionado || loading}
          >
            {loading ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        </div>
      )}

      {/* PIX - QR Code */}
      {pagamento && pagamento.metodoPagamento === MetodoPagamento.PIX && pagamento.status === StatusPagamento.PENDENTE && (
        <div className="pix-container">
          <h2>🎯 Pague com PIX</h2>
          
          <div className="pix-qrcode">
            {pagamento.pixQrCode && (
              <img 
                src={`data:image/png;base64,${pagamento.pixQrCode}`} 
                alt="QR Code PIX"
                className="qrcode-image"
              />
            )}
          </div>

          <div className="pix-codigo">
            <p>Ou copie o código:</p>
            <div className="codigo-container">
              <code>{pagamento.pixQrCodeData?.substring(0, 50)}...</code>
              <button 
                className="btn-copiar"
                onClick={copiarPixCodigo}
              >
                {pixCopiado ? (
                  <>
                    <CheckCircle size={16} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pix-instrucoes">
            <h3>Como pagar:</h3>
            <ol>
              <li>Abra o app do seu banco</li>
              <li>Escolha pagar com PIX</li>
              <li>Escaneie o QR Code ou cole o código</li>
              <li>Confirme o pagamento</li>
            </ol>
            <p className="pix-expiracao">
              ⏰ Este código expira em: {' '}
              {pagamento.dataExpiracao && new Date(pagamento.dataExpiracao).toLocaleTimeString('pt-BR')}
            </p>
          </div>

          {/* Botão para simular confirmação (apenas desenvolvimento) */}
          <button
            className="btn-simular"
            onClick={confirmarPagamentoManual}
            disabled={loading}
          >
            🧪 Simular Confirmação (DEV)
          </button>
        </div>
      )}

      {/* Cartão de Crédito (placeholder) */}
      {pagamento && pagamento.metodoPagamento === MetodoPagamento.CREDITO && (
        <div className="cartao-container">
          <h2>💳 Cartão de Crédito</h2>
          <p>Funcionalidade em desenvolvimento...</p>
          {pagamento.linkPagamento && (
            <a href={pagamento.linkPagamento} target="_blank" rel="noopener noreferrer">
              Ir para checkout →
            </a>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Informações de Segurança */}
      <div className="checkout-seguranca">
        <p>🔒 Pagamento 100% seguro</p>
        <small>Seus dados são protegidos com criptografia SSL/TLS</small>
      </div>
    </div>
  );
};
