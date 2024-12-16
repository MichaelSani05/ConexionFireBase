import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule
  ],
  template: `
    <div class="register-container">
      <form 
        [formGroup]="registerForm" 
        (ngSubmit)="onRegister()"
        class="register-form"
      >
        <h2>Registro de Usuario</h2>
        
        <!-- Nombre Completo -->
        <div class="form-group">
          <label for="fullName">Nombre Completo</label>
          <input 
            type="text" 
            id="fullName"
            formControlName="fullName"
            placeholder="Ingrese su nombre completo"
            class="form-control"
          >
          <small 
            *ngIf="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched" 
            class="error-message"
          >
            Nombre completo es requerido
          </small>
        </div>
        
        <!-- Email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email"
            formControlName="email"
            placeholder="Ingrese su correo"
            class="form-control"
          >
          <small 
            *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
            class="error-message"
          >
            Correo electrónico inválido
          </small>
        </div>
        
        <!-- Password -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password"
            formControlName="password"
            placeholder="Ingrese su contraseña"
            class="form-control"
          >
          <small 
            *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
            class="error-message"
          >
            La contraseña debe tener al menos 6 caracteres
          </small>
        </div>

        <!-- Confirmar Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword"
            formControlName="confirmPassword"
            placeholder="Confirme su contraseña"
            class="form-control"
          >
          <small 
            *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" 
            class="error-message"
          >
            Las contraseñas no coinciden
          </small>
        </div>

        <!-- Error Message -->
        <div 
          *ngIf="errorMessage()" 
          class="error-message"
        >
          {{ errorMessage() }}
        </div>
        
        <!-- Register Button -->
        <button 
          type="submit" 
          [disabled]="registerForm.invalid"
          class="btn-register"
        >
          Registrarse
        </button>

        <!-- Login Link -->
        <p class="login-link">
          ¿Ya tienes cuenta? 
          <a [routerLink]="['/login']">Inicia Sesión</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .register-form {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-register {
      width: 100%;
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-register:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .error-message {
      color: red;
      font-size: 0.8em;
      margin-top: 5px;
    }
    .login-link {
      text-align: center;
      margin-top: 15px;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signal para manejar mensajes de error
  errorMessage = signal<string | null>(null);

  // Formulario reactivo con validaciones
  registerForm: FormGroup = this.fb.group({
    fullName: ['', [
      Validators.required, 
      Validators.minLength(3)
    ]],
    email: ['', [
      Validators.required, 
      Validators.email
    ]],
    password: ['', [
      Validators.required, 
      Validators.minLength(6)
    ]],
    confirmPassword: ['', [
      Validators.required
    ]]
  }, { 
    validators: this.passwordMatchValidator 
  });

  // Validador personalizado para comparar contraseñas
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  onRegister() {
    // Limpiar mensaje de error
    this.errorMessage.set(null);

    if (this.registerForm.valid) {
      const { 
        fullName, 
        email, 
        password 
      } = this.registerForm.value;

      this.authService.register(email, password, fullName ).subscribe({
        next: () => {
          // Redirigir al dashboard o página principal
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // Manejar diferentes tipos de errores
          switch(error.code) {
            case 'auth/email-already-in-use':
              this.errorMessage.set('El correo ya está registrado');
              break;
            case 'auth/invalid-email':
              this.errorMessage.set('Correo electrónico inválido');
              break;
            default:
              this.errorMessage.set('Error al registrar usuario');
          }
        }
      });
    }
  }
}
