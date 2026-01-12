import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface HeaderProps {
  title?: string
}

export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">VITAS</h1>
          {title && <p className="text-gray-600">{title}</p>}
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-600">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
