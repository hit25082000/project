import { Routes } from '@angular/router';

export const monetizationRoutes: Routes = [
  {
    path: 'billing',
    loadComponent: () =>
      import('./pages/billing.page').then((m) => m.BillingPage),
    data: { title: 'Billing & Subscription' },
  },
  {
    path: 'plans',
    loadComponent: () =>
      import('./pages/plan-selector.page').then((m) => m.PlanSelectorPage),
    data: { title: 'Choose Plan' },
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./pages/payment.page').then((m) => m.PaymentPage),
    data: { title: 'Payment' },
  },
  {
    path: 'admin/billing',
    loadComponent: () =>
      import('./pages/admin-billing.page').then((m) => m.AdminBillingPage),
    data: { title: 'Admin - Billing Management' },
  },
  {
    path: '',
    redirectTo: 'billing',
    pathMatch: 'full',
  },
];
