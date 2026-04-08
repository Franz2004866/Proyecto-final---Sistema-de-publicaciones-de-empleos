import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'empleos/:id',
    loadComponent: () => import('./pages/job-detail/job-detail.page').then((m) => m.JobDetailPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'callback',
    loadComponent: () => import('./pages/auth/callback/callback.page').then((m) => m.CallbackPage),
  },
  {
    path: 'app',
    canMatch: [authGuard],
    loadComponent: () => import('./shared/layout/app-layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'empleos',
        loadComponent: () => import('./pages/dashboard/jobs/jobs.page').then((m) => m.JobsPage),
      },
      {
        path: 'empleos/nuevo',
        loadComponent: () => import('./pages/dashboard/job-form/job-form.page').then((m) => m.JobFormPage),
      },
      {
        path: 'empleos/:id/editar',
        loadComponent: () => import('./pages/dashboard/job-form/job-form.page').then((m) => m.JobFormPage),
      },
      {
        path: 'postulaciones',
        loadComponent: () => import('./pages/dashboard/applications/applications.page').then((m) => m.ApplicationsPage),
      },
      {
        path: 'mis-postulaciones',
        loadComponent: () => import('./pages/dashboard/my-applications/my-applications.page').then((m) => m.MyApplicationsPage),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/dashboard/categories/categories.page').then((m) => m.CategoriesPage),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/dashboard/users/users.page').then((m) => m.UsersPage),
      },
      {
        path: 'reportes',
        loadComponent: () => import('./pages/dashboard/reports/reports.page').then((m) => m.ReportsPage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];