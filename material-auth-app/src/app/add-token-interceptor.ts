import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from './users/userService';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  if (userService.isLoggedIn()) {
    const reqWithToken = req.clone(
      { headers: req.headers.set('Authorization', 'Bearer ' + userService.token()) });

    return next(reqWithToken);
  } else {
    return next(req);
  }

};
