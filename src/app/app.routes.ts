import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'users',
    loadComponent: () =>
      import('./domain/user/pages/user-list.page/user-list.page').then(
        (m) => m.UserListPage
      ),
  },
  {
    path: 'monetization',
    loadChildren: () =>
      import('./domain/monetization/monetization.routes').then(
        (m) => m.monetizationRoutes
      ),
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
];
