import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { Router } from '@angular/router';
import { UserLoged } from '../../../Models/UserLoged';
import localeEs from '@angular/common/locales/es';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  user: UserLoged | null = null;
  loading = true;
  error = '';
  currentYear = new Date().getFullYear();

  constructor() {
    // Registrar localización española para formatear fechas
    registerLocaleData(localeEs);
  }

  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.authService.getLogedUserInfo().subscribe({
      next: (user) => {
        this.user = user;
        console.log('Usuario logueado:', this.user);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el perfil de usuario';
        this.loading = false;
        console.error('Error fetching user:', err);
      }
    });
  }
  formatDate(dateString?: string): string {
    if (!dateString) return 'No disponible';
    try {
      return formatDate(new Date(dateString), 'dd/MM/yyyy', 'es-ES');
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
  }

  getRoleName(roleId?: string):string {
    if (!roleId) return 'No disponible';
    switch (roleId) {
      case 'Analyst':
        return 'Analista';
      case 'Applicant':
        return 'Solicitante';
      case 'Administrator':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  }  // El manejo del logout se ha trasladado al componente de header
}
