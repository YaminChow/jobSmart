import { Router, Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in';
import { SignUp } from './pages/sign-up/sign-up';
import { inject } from '@angular/core';
import { UserService } from './users/userService';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent, title:"Job Smart App" },
  { path: 'signup', component: SignUp, title: "Sign Up" },
  { path: 'jobs', loadChildren: () => import('./pages/dashboard/routes').then(routes => routes.jobRoutes) ,
         
    canActivate: [() => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
}]
}


];

