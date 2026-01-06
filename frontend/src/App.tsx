import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { ToastProvider } from './components/Toast'
import { InstallPWA } from './components/InstallPWA'

// Pages
import LandingPage from './pages/Landing'
import LoginPage from './pages/auth/Login'
import CadastroProfissional from './pages/profissional/CadastroProfissional'
import TermosDeUso from './pages/legal/TermosDeUso'
import PoliticaPrivacidade from './pages/legal/PoliticaPrivacidade'
import FAQ from './pages/legal/FAQ'
import { Checkout } from './pages/checkout/Checkout'
// import DashboardClientePage from './pages/dashboard/ClienteDashboard'
// import DashboardOperatorPage from './pages/dashboard/OperadorDashboard'
import ChamadoListPage from './pages/chamado/ChamadoList'
import ChamadoDetailPage from './pages/chamado/ChamadoDetail'
import CriarChamadoPage from './pages/chamado/CriarChamado'
import AdminChamadosPage from './pages/admin/AdminChamados'
import AdminTriagemPage from './pages/admin/AdminTriagem'
import AdminAgendamentoPage from './pages/admin/AdminAgendamento'

// Layouts
import MainLayout from './layouts/MainLayout'
// import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'

// Components
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <ToastProvider>
      <Router>
      <InstallPWA />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro-profissional" element={<CadastroProfissional />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Client Routes */}
        <Route
          path="/chamados"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <ChamadoListPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chamados/new"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <CriarChamadoPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chamados/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <ChamadoDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:orcamentoId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout>
                <Checkout />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Operator Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout>
                <AdminChamadosPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chamados/:id/triagem"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout>
                <AdminTriagemPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chamados/:id/agendamento"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout>
                <AdminAgendamentoPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </ToastProvider>
  )
}
