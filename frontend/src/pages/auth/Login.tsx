import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../components/Toast'
import { BackButton } from '../../components/BackButton'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { addToast } = useToast()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      setLoading(true)
      const response = await authService.login(data)
      login(response.token, response.user)
      addToast('success', `Bem-vindo, ${response.user.nome}!`)
      navigate(response.user.role === 'operador' ? '/admin' : '/chamados')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao fazer login'
      setError(errorMsg)
      addToast('error', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <BackButton to="/" />
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 mt-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-blue-600">
              VITAS
            </h1>
            <h2 className="text-2xl font-bold text-gray-800">Fazer Login</h2>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <input
                {...register('password')}
                type="password"
                className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Não tem conta?{' '}
            <button onClick={() => navigate('/signup')} className="text-blue-600 hover:text-blue-700 font-semibold">
              Registre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

