import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'users',
    loadComponent: () =>
      import('./domain/user/components/user-list/user-list.page').then(
        (m) => m.UserListPage
      ),
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
];
