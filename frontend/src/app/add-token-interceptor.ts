// import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { UserService } from './users/userService';
// import { catchError, switchMap, throwError } from 'rxjs';

// export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
//   const userService = inject(UserService);
//   if (userService.isLoggedIn()) {
//     const reqWithToken = req.clone(
//       { headers: req.headers.set('Authorization', 'Bearer ' + userService.token()) });

//     return next(reqWithToken);
//   } else {
//     return next(req);
//   }

// };

// export const addTokenInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn
// ) => {
//   const userService = inject(UserService);

//   const reqWithToken = userService.isLoggedIn()
//     ? req.clone({
//         headers: req.headers.set('Authorization', 'Bearer ' + userService.token())
//       })
//     : req;

//   return next(reqWithToken).pipe(
//     catchError((err: HttpErrorResponse) => {
//       if (err.status === 401) {
//         return userService.refreshAccessToken().pipe(
//           switchMap(response => {
//             const newToken = response.data.token;
//             userService.token.set(newToken);
//             const retriedReq = req.clone({
//               headers: req.headers.set('Authorization', 'Bearer ' + newToken)
//             });
//             return next(retriedReq);
//           }),
//           catchError(() => {
//             userService.signout();
//             return throwError(() => err);
//           })
//         );
//       }
//       return throwError(() => err);
//     })
//   );
// };

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from './users/userService';

export const addTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const userService = inject(UserService);

  const reqWithToken = userService.isLoggedIn()
    ? req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + userService.token()),
        withCredentials: true
      })
    : req.clone({
        withCredentials: true
      });

  return next(reqWithToken).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return userService.refreshAccessToken().pipe(
          switchMap(response => {
            const newToken = response.data.accessToken;
            userService.token.set(newToken);
            const retriedReq = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + newToken),
              withCredentials: true
            });
            return next(retriedReq);
          }),
          catchError(() => {
            userService.signout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};