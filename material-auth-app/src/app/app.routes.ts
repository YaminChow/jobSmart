import { Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in';
import { SignUp } from './pages/sign-up/sign-up';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUp },
  { path: 'jobs', loadChildren: () => import('./pages/dashboard/routes').then(routes => routes.jobRoutes) }
//   { path: 'dashboard', component: DashboardComponent },
];