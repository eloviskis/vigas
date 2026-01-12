import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { authService } from '../../services/authService'
import Spinner from '../../components/Spinner'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      navigate('/login?error=no_token')
      return
    }

    // Obter dados do usuário com o token
    const handleCallback = async () => {
      try {
        // Salvar token temporariamente
        localStorage.setItem('token', token)
        
        // Buscar dados do usuário
        const user = await authService.me()
        
        // Login completo
        login(token, user)
        
        // Redirecionar baseado no role
        if (user.role === 'operador' || user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/chamados')
        }
      } catch (error) {
        console.error('Erro no callback OAuth:', error)
        navigate('/login?error=invalid_token')
      }
    }

    handleCallback()
  }, [searchParams, login, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Autenticando...</p>
      </div>
    </div>
  )
}
