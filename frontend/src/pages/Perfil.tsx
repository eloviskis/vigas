import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/authService'
import { useToast } from '../components/Toast'
import { User, Lock, Mail, Shield, LogOut } from 'lucide-react'

const perfilSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
})

const senhaSchema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual obrigatória'),
  novaSenha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string().min(6, 'Confirmação obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: 'Senhas não conferem',
  path: ['confirmarSenha'],
})

type PerfilFormData = z.infer<typeof perfilSchema>
type SenhaFormData = z.infer<typeof senhaSchema>

export default function PerfilPage() {
  const { user, updateUser, logout } = useAuthStore()
  const { addToast } = useToast()
  const [loadingPerfil, setLoadingPerfil] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [showSenhaForm, setShowSenhaForm] = useState(false)

  const {
    register: registerPerfil,
    handleSubmit: handleSubmitPerfil,
    formState: { errors: errorsPerfil },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
    },
  })

  const {
    register: registerSenha,
    handleSubmit: handleSubmitSenha,
    formState: { errors: errorsSenha },
    reset: resetSenha,
  } = useForm<SenhaFormData>({
    resolver: zodResolver(senhaSchema),
  })

  const onSubmitPerfil = async (data: PerfilFormData) => {
    if (!user) return

    try {
      setLoadingPerfil(true)
      const updated = await authService.updateProfile(data)
      updateUser(updated)
      addToast('success', 'Perfil atualizado com sucesso!')
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Erro ao atualizar perfil')
    } finally {
      setLoadingPerfil(false)
    }
  }

  const onSubmitSenha = async (data: SenhaFormData) => {
    try {
      setLoadingSenha(true)
      await authService.changePassword({
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha,
      })
      addToast('success', 'Senha alterada com sucesso!')
      setShowSenhaForm(false)
      resetSenha()
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Erro ao alterar senha')
    } finally {
      setLoadingSenha(false)
    }
  }

  const handleLogout = () => {
    logout()
    addToast('success', 'Logout realizado com sucesso!')
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Você precisa estar logado para ver seu perfil.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Sair</span>
        </button>
      </div>

      {/* Card de Informações */}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Informações Pessoais</h2>
            <p className="text-sm text-gray-500">Atualize seus dados básicos</p>
          </div>
        </div>

        <form onSubmit={handleSubmitPerfil(onSubmitPerfil)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                {...registerPerfil('nome')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome"
              />
              {errorsPerfil.nome && (
                <p className="text-red-600 text-sm mt-1">{errorsPerfil.nome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...registerPerfil('email')}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
              {errorsPerfil.email && (
                <p className="text-red-600 text-sm mt-1">{errorsPerfil.email.message}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">Role do usuário</p>
              <p className="text-sm text-blue-700">
                Você está cadastrado como: <span className="font-bold uppercase">{user.role}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loadingPerfil}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl transition-all"
            >
              {loadingPerfil ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Card de Senha */}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Segurança</h2>
            <p className="text-sm text-gray-500">Altere sua senha de acesso</p>
          </div>
          {!showSenhaForm && (
            <button
              onClick={() => setShowSenhaForm(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium shadow-lg"
            >
              Alterar Senha
            </button>
          )}
        </div>

        {showSenhaForm && (
          <form onSubmit={handleSubmitSenha(onSubmitSenha)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual *
              </label>
              <input
                {...registerSenha('senhaAtual')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
              {errorsSenha.senhaAtual && (
                <p className="text-red-600 text-sm mt-1">{errorsSenha.senhaAtual.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha *
                </label>
                <input
                  {...registerSenha('novaSenha')}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
                {errorsSenha.novaSenha && (
                  <p className="text-red-600 text-sm mt-1">{errorsSenha.novaSenha.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha *
                </label>
                <input
                  {...registerSenha('confirmarSenha')}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
                {errorsSenha.confirmarSenha && (
                  <p className="text-red-600 text-sm mt-1">{errorsSenha.confirmarSenha.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loadingSenha}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {loadingSenha ? 'Alterando...' : 'Alterar Senha'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSenhaForm(false)
                  resetSenha()
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Membro desde:</span>{' '}
          {user.criadoEm ? new Date(user.criadoEm).toLocaleDateString('pt-BR') : 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">ID do usuário:</span> {user.id}
        </p>
      </div>
    </div>
  )
}
