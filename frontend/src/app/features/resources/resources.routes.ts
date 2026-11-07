import { Routes } from '@angular/router';

export const RESOURCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/resource-list/resource-list.page')
      .then(m => m.ResourceListPage)
  }
];

