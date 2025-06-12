import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Obtener el token usando el servicio de autenticación
  const token = authService.getToken();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/Auth/login', '/Auth/register'];
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  // Si es una ruta pública, no necesitamos token
  if (isPublicRoute) {
    return next(req);
  }

  // Si tenemos token, lo añadimos a la petición
  if (token) {
    // Clonamos la petición y añadimos el token
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    // Enviamos la petición clonada y manejamos errores
    return next(authReq).pipe(
      catchError(error => {
        // Si obtenemos un error 401 o 403, el token es inválido o ha expirado
        if (error.status === 401 || error.status === 403) {
          // Limpiamos el almacenamiento
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');

          // Redirigimos al login
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Si no hay token y la ruta requiere autenticación, redirigimos al login
  router.navigate(['/login']);
  return throwError(() => new Error('Se requiere autenticación para acceder a este recurso'));
};
