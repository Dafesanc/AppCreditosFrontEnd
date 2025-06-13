import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { UserLoged } from '../../../../Models/UserLoged';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: UserLoged | null = null;
  showUsersMenu = false;

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getLogedUserInfo().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.showUsersMenu = user.role === 'Analyst';
      },
      error: (err) => {
        console.error('Error al obtener usuario actual en header:', err);
        this.showUsersMenu = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Eliminar tokens de ambos almacenamientos
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Aún así, eliminamos el token y redirigimos
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
