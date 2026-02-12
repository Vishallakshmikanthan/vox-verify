import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; // Assuming we create this or use functional guard

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [] // Add AuthGuard later
    },
    {
        path: 'analyze',
        loadComponent: () => import('./features/voice-analysis/voice-analysis.component').then(m => m.VoiceAnalysisContainerComponent),
        canActivate: []
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
