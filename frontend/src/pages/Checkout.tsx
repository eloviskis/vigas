import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pagamentoService } from '../services/pagamentoService';
import QRCode from 'qrcode';

export const Checkout: React.FC = () => {
  const { orcamentoId } = useParams();
  const [orcamento, setOrcamento] = useState<any>(null);
  const [metodo, setMetodo] = useState<'pix' | 'cartao' | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrcamento();
  }, [orcamentoId]);

  const loadOrcamento = async () => {
    try {
      const data = await pagamentoService.obterOrcamento(orcamentoId!);
      setOrcamento(data);
    } catch (err) {
      setError('Erro ao carregar orçamento');
    }
  };

  const handlePix = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await pagamentoService.criarCheckoutPix(orcamentoId!);
      setPixCode(response.pixCode);
      
      const qrCodeDataURL = await QRCode.toDataURL(response.pixCode);
      setQrCode(qrCodeDataURL);
      setMetodo('pix');
    } catch (err) {
      setError('Erro ao gerar PIX');
    } finally {
      setLoading(false);
    }
  };

  const handleCartao = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await pagamentoService.criarCheckoutCartao(orcamentoId!);
      window.location.href = response.checkoutUrl;
    } catch (err) {
      setError('Erro ao processar cartão');
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };

  if (!orcamento) return <div>Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold mb-2">{orcamento.descricao}</h2>
        <p className="text-gray-600 mb-4">Profissional: {orcamento.profissional?.nome}</p>
        <div className="text-3xl font-bold text-blue-600">
          R$ {orcamento.valor?.toFixed(2)}
        </div>
      </div>

      {!metodo && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handlePix}
            disabled={loading}
            className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold">PIX</div>
            <div className="text-sm">Aprovação instantânea</div>
          </button>

          <button
            onClick={handleCartao}
            disabled={loading}
            className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold">Cartão de Crédito</div>
            <div className="text-sm">Parcelamento disponível</div>
          </button>
        </div>
      )}

      {metodo === 'pix' && qrCode && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Pague com PIX</h3>
          <div className="flex flex-col items-center">
            <img src={qrCode} alt="QR Code PIX" className="w-64 h-64 mb-4" />
            <div className="w-full">
              <p className="text-sm text-gray-600 mb-2">Ou copie o código:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pixCode}
                  readOnly
                  className="flex-1 p-2 border rounded text-sm"
                />
                <button
                  onClick={copyPixCode}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Aguardando pagamento...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default Checkout;
