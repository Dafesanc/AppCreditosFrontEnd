import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users/users.service';
import { User, UserUpdate } from '../../../../Models/User';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<User>();

  private formBuilder = inject(FormBuilder);
  private usersService = inject(UsersService);

  editForm!: FormGroup;
  loading = false;
  error = '';

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.editForm = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      identificationNumber: [this.user.identificationNumber, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      birthDate: [this.user.birthDate ? this.formatDateForInput(this.user.birthDate) : '', [Validators.required]]
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.loading = true;
      this.error = '';

      const updateData: UserUpdate = {
        firstName: this.editForm.value.firstName,
        lastName: this.editForm.value.lastName,
        email: this.editForm.value.email,
        identificationNumber: this.editForm.value.identificationNumber,
        role: parseInt(this.editForm.value.role),
        birthDate: this.editForm.value.birthDate
      };

      this.usersService.updateUser(this.user.id, updateData).subscribe({
        next: (updatedUser) => {
          this.userUpdated.emit(updatedUser);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al actualizar el usuario';
          this.loading = false;
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getRoleName(roleId: number): string {
    switch(roleId) {
      case 1: return 'Solicitante';
      case 2: return 'Analista';
      default: return 'Usuario';
    }
  }
}
