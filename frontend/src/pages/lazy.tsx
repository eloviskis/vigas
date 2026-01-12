import { lazy, Suspense } from 'react';
import { Spinner } from '../components/Spinner';

// Lazy load das páginas principais
export const ChamadoList = lazy(() =>
  import('./ChamadoList').then((module) => ({ default: module.ChamadoList }))
);

export const ChamadoDetail = lazy(() =>
  import('./ChamadoDetail').then((module) => ({
    default: module.ChamadoDetail,
  }))
);

export const Checkout = lazy(() =>
  import('./Checkout').then((module) => ({ default: module.Checkout }))
);

export const AdminDashboard = lazy(() =>
  import('./admin/AdminDashboard').then((module) => ({
    default: module.AdminDashboard,
  }))
);

export const AdminPagamentos = lazy(() =>
  import('./admin/AdminPagamentos').then((module) => ({
    default: module.AdminPagamentos,
  }))
);

export const AdminTriagem = lazy(() =>
  import('./admin/AdminTriagem').then((module) => ({
    default: module.AdminTriagem,
  }))
);

export const ProfissionalPerfil = lazy(() =>
  import('./ProfissionalPerfil').then((module) => ({
    default: module.ProfissionalPerfil,
  }))
);

// HOC para envolver rotas com Suspense
export const withLazyLoad = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );
};
