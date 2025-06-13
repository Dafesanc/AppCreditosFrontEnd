import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../../Models/User';
import { UserLoged } from '../../../Models/UserLoged';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, ReactiveFormsModule, EditUserComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private router = inject(Router);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);

  // Estados del componente
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  error = '';
  unauthorizedAccess = false;
  currentUser: UserLoged | null = null;

  // Modal state
  showEditModal = false;
  selectedUser: User | null = null;

  // Form controls
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getLogedUserInfo().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Usuario actual:', user);
        if (user.role === 'Analyst') {
          this.loadUsers();
        } else {
          this.unauthorizedAccess = true;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener usuario actual:', err);
        this.error = 'Error al verificar permisos';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.unauthorizedAccess = true;
        } else {
          this.error = 'Error al cargar la lista de usuarios';
        }
        this.loading = false;
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  onSearch(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.showEditModal = true;
  }

  deleteUser(user: User): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.firstName} ${user.lastName}?`)) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
          console.log('Usuario eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.error = 'Error al eliminar el usuario';
        }
      });
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  onUserUpdated(updatedUser: User): void {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.filteredUsers = [...this.users];
      this.onSearch(); // Reaplicar filtro
    }
    this.closeEditModal();
  }

  getRoleName(role: number): string {
    switch(role) {
      case 1: return 'Solicitante';
      case 2: return 'Analista';
      default: return 'Usuario';
    }
  }



}
