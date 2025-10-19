import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadComponent: () =>
      import('@domain/user/pages/user-list.page/user-list.page').then(
        (m) => m.UserListPage
      ),
  },
  {
    path: 'users/:id/edit',
    loadComponent: () =>
      import('@domain/user/pages/user-edit.page/user-edit.page').then(
        (m) => m.UserEditPage
      ),
  },
];
