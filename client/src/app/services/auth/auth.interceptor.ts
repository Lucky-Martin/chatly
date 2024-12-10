import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
  HttpHandlerFn) => {
  const userToken = localStorage.getItem('auth_token');

  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${userToken}`),
  });

  return next(modifiedReq);
};
