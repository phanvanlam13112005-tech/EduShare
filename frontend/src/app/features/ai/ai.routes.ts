import { Routes } from '@angular/router';

export const AI_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ai-assistant/ai-assistant.page')
      .then(m => m.AiAssistantPage)
  }
];

