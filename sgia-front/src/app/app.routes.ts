import { Routes } from '@angular/router';
import { authGuard } from './core/authentication/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./features/auth/pages/callback/callback.page').then((m) => m.CallbackPage),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/product-list/product-list.page').then(
            (m) => m.ProductListPage,
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/products/pages/product-form/product-form.page').then(
            (m) => m.ProductFormPage,
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/products/pages/product-detail/product-detail.page').then(
            (m) => m.ProductDetailPage,
          ),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/products/pages/product-form/product-form.page').then(
            (m) => m.ProductFormPage,
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/pages/category-list/category-list.page').then(
            (m) => m.CategoryListPage,
          ),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./features/categories/pages/category-form/category-form.page').then(
            (m) => m.CategoryFormPage,
          ),
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import('./features/categories/pages/category-form/category-form.page').then(
            (m) => m.CategoryFormPage,
          ),
      },
      {
        path: 'movements',
        loadComponent: () =>
          import('./features/movements/pages/movement-list/movement-list.page').then(
            (m) => m.MovementListPage,
          ),
      },
      {
        path: 'movements/new',
        loadComponent: () =>
          import('./features/movements/pages/movement-form/movement-form.page').then(
            (m) => m.MovementFormPage,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/pages/report-view/report-view.page').then(
            (m) => m.ReportViewPage,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
