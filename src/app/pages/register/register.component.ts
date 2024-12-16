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
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  onRegister() {
    this.errorMessage.set(null);

    if (this.registerForm.valid) {
      const { fullName, email, password } = this.registerForm.value;

      this.authService.register(email, password, {email: email, fullName: fullName} ).subscribe({
        next: () => {
          this.router.navigate(['/home']); 
        },
        error: (error) => {
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
