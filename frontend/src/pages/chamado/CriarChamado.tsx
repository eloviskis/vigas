import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { chamadoService } from '../../services/chamadoService'
import { useAuthStore } from '../../stores/authStore'
import { useState } from 'react'
import { useToast } from '../../components/Toast'
import { BackButton } from '../../components/BackButton'

const criarChamadoSchema = z.object({
  titulo: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  contexto: z.enum(['Casa', 'Saúde', 'Empresa']),
  categoria: z.string().optional(),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA']).optional(),
})

type CriarChamadoFormData = z.infer<typeof criarChamadoSchema>

export default function CriarChamadoPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CriarChamadoFormData>({
    resolver: zodResolver(criarChamadoSchema),
  })

  const onSubmit = async (data: CriarChamadoFormData) => {
    if (!user) return

    try {
      setLoading(true)
      const chamado = await chamadoService.criar({
        usuarioId: user.id,
        ...data,
        prioridade: data.prioridade || 'MEDIA',
      })
      addToast('success', 'Chamado criado com sucesso!')
      navigate(`/chamados/${chamado.id}`)
    } catch (err: any) {
      console.error(err)
      addToast('error', err.response?.data?.message || 'Erro ao criar chamado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton to="/chamados" />
      <h1 className="text-3xl font-bold mb-8">Criar Novo Chamado</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            {...register('titulo')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Resuma seu problema em uma frase"
          />
          {errors.titulo && <p className="text-red-600 text-sm mt-1">{errors.titulo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
          <textarea
            {...register('descricao')}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva detalhadamente o que você precisa"
          />
          {errors.descricao && <p className="text-red-600 text-sm mt-1">{errors.descricao.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contexto *</label>
            <select
              {...register('contexto')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              <option value="Casa">Casa</option>
              <option value="Saúde">Saúde</option>
              <option value="Empresa">Empresa</option>
            </select>
            {errors.contexto && <p className="text-red-600 text-sm mt-1">{errors.contexto.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <input
              {...register('categoria')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Encanamento, Informática"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
          <select
            {...register('prioridade')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Criando...' : 'Criar Chamado'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/chamados')}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
