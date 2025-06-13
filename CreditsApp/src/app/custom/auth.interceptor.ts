// Este archivo está obsoleto ya que ahora usamos el interceptor en la carpeta interceptors
import { HttpInterceptorFn } from '@angular/common/http';

export const oldAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Esta función ya no se usa
  return next(req);
};
