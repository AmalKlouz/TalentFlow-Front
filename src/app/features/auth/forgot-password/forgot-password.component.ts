import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ForgotPasswordRequest } from '../../../core/models/ForgotPasswordRequest'; 
import { ResetPasswordRequest } from '../../../core/models/ResetPasswordRequest'; 

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  step = 1;

  loading = false;
  errorMessage = '';
  successMessage = '';

  email = '';

  forgotForm: FormGroup;
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });

    this.resetForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required]
    });
  }

  sendCode(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.email = this.forgotForm.get('email')?.value;

    const request: ForgotPasswordRequest = {
      email: this.email
    };

    this.loading = true;

    this.authService.forgotPassword(request).subscribe({

      next: () => {

        this.loading = false;
        this.step = 2;

        this.successMessage =
          'Un code de vérification a été envoyé à votre adresse email.';
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message
          || 'Impossible d’envoyer le code. Vérifiez votre adresse email.';
      }
    });
  }

  resetPassword(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const code =
      this.resetForm.get('code')?.value;

    const newPassword =
      this.resetForm.get('newPassword')?.value;

    const confirmPassword =
      this.resetForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {

      this.errorMessage =
        'Les mots de passe ne correspondent pas.';

      return;
    }

    const request: ResetPasswordRequest = {
      email: this.email,
      code: code,
      newPassword: newPassword
    };

    this.loading = true;

    this.authService.resetPassword(request).subscribe({

      next: () => {

        this.loading = false;
        this.step = 3;

        this.successMessage =
          'Votre mot de passe a été réinitialisé avec succès.';
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message
          || 'Code incorrect ou expiré.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

