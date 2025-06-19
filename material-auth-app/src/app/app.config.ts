import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { UserService } from './users/userService';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addTokenInterceptor } from './add-token-interceptor';

const init = () => {
  const userService = inject(UserService);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token) {
    userService.token.set(token);
  }
  if (user) {
    userService.user.set(JSON.parse(user));
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(init),
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding())
  ]
};
