import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/student-dashboard/student-dashboard.page')
      .then(m => m.StudentDashboardPage)
  }
];

