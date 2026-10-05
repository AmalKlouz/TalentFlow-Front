import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ]
    });
  }

  onSubmit(): void {

    this.errorMessage = '';

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.authService
      .login(this.loginForm.value)
      .subscribe({

        next: (response) => {

          this.authService.saveAuthData(response);

          this.loading = false;

          console.log('Connexion réussie :', response);

          // Pour l'instant, on retourne à l'accueil
          this.router.navigate(['/']);
        },

        error: (error) => {

          this.loading = false;

          console.error('Erreur de connexion :', error);

          this.errorMessage =
            error?.error?.message
            || 'Email ou mot de passe incorrect.';
        }
      });
  }
}
