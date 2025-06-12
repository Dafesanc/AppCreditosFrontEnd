import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../../../Models/Login';
import { register } from '../../../Models/Register';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public formRegister: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  // Estados de foco para cada campo
  firstNameFocused = false;
  lastNameFocused = false;
  emailFocused = false;
  identificationTypeFocused = false;
  identificationNumberFocused = false;
  roleFocused = false;
  birthDateFocused = false;
  passwordFocused = false;
  confirmPasswordFocused = false;

  // Fondo de imagen
  backgroundImageUrl = 'assets/imagen-banner.png';

  private router = inject(Router); // Injecting Router for navigation
  private formBuilder = inject(FormBuilder); // Injecting FormBuilder for form handling
  private authService = inject(AuthService);

  constructor() {
    this.formRegister = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      identificationType: ['', [Validators.required]],
      identificationNumber: ['', [Validators.required, Validators.minLength(8)]],
      birthDate: ['', [Validators.required]],
      role : [1, [Validators.required]] // Default role set to 'Applicant'
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { passwordMismatch: true };
  }
  // Método para manejar el foco de los campos
  onFieldFocus(field: string) {
    switch(field) {
      case 'firstName': this.firstNameFocused = true; break;
      case 'lastName': this.lastNameFocused = true; break;
      case 'email': this.emailFocused = true; break;
      case 'identificationType': this.identificationTypeFocused = true; break;
      case 'identificationNumber': this.identificationNumberFocused = true; break;
      case 'role': this.roleFocused = true; break;
      case 'birthDate': this.birthDateFocused = true; break;
      case 'password': this.passwordFocused = true; break;
      case 'confirmPassword': this.confirmPasswordFocused = true; break;
    }
  }

  // Método para manejar cuando se quita el foco de los campos
  onFieldBlur(field: string) {
    switch(field) {
      case 'firstName': this.firstNameFocused = false; break;
      case 'lastName': this.lastNameFocused = false; break;
      case 'email': this.emailFocused = false; break;
      case 'identificationType': this.identificationTypeFocused = false; break;
      case 'identificationNumber': this.identificationNumberFocused = false; break;
      case 'role': this.roleFocused = false; break;
      case 'birthDate': this.birthDateFocused = false; break;
      case 'password': this.passwordFocused = false; break;
      case 'confirmPassword': this.confirmPasswordFocused = false; break;
    }
  }

  // Métodos para mostrar/ocultar contraseñas
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  switchToLogin() {
    this.router.navigate(['login']);
  }

  registrarse() {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched(); // Mark all fields as touched to trigger validation styles
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const registerData: register = {
      email: this.formRegister.value.email!,
      password: this.formRegister.value.password!,
      firstName: this.formRegister.value.firstName!,
      lastName: this.formRegister.value.lastName!,
      identificationType: this.formRegister.value.identificationType!,
      identificationNumber: this.formRegister.value.identificationNumber!,
      birthDate: this.formRegister.value.birthDate!,
      role: parseInt(this.formRegister.value.role!, 10) || 1 // Default to 'Applicant' if not specified
    };
    console.log('Datos de registro:', registerData);

    this.authService.registrarse(registerData).subscribe({
      next: (response) => {
        if (response && response.token) {
          // Guarda el token y redirige al usuario
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'No se pudo completar el registro. Por favor, intenta de nuevo.';
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error en el servidor. Por favor, intenta de nuevo más tarde.';
        console.error('Error en el registro:', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
