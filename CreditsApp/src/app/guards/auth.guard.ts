import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Obtener el token usando el servicio de autenticación
  const token = authService.getToken();

  // Si no hay token, redirige a login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    // Verificar si el token es válido
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // Token expirado
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      router.navigate(['/login']);
      return false;
    }

    // Token válido
    return true;
  } catch (error) {
    // Error al decodificar el token
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }
};
