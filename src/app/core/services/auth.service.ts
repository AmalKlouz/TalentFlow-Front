import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request'; 
import { RegisterRequest } from '../models/register-request'; 
import { AuthResponse } from '../models/auth-response'; 
import { UserResponse } from '../models/user-response'; 
import { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL =
    'http://localhost:8081/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  // =========================================================
  // LOGIN
  // =========================================================

  login(
    request: LoginRequest
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.API_URL}/login`,
      request
    );
  }

  // =========================================================
  // REGISTER
  // =========================================================

register(
  request: RegisterRequest
): Observable<UserResponse> {

  return this.http.post<UserResponse>(
    `${this.API_URL}/register`,
    request
  );
}


  // =========================================================
  // SAVE AUTH DATA
  // =========================================================

  saveAuthData(
    response: AuthResponse
  ): void {

    localStorage.setItem(
      'token',
      response.token
    );

    localStorage.setItem(
      'userId',
      response.userId.toString()
    );

    localStorage.setItem(
      'firstName',
      response.firstName
    );

    localStorage.setItem(
      'lastName',
      response.lastName
    );

    localStorage.setItem(
      'email',
      response.email
    );

    localStorage.setItem(
      'role',
      response.role
    );
  }

  // =========================================================
  // GET TOKEN
  // =========================================================

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  // =========================================================
  // GET ROLE
  // =========================================================

  getRole(): string | null {

    return localStorage.getItem('role');
  }

  // =========================================================
  // CHECK LOGIN
  // =========================================================

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    localStorage.clear();
  }
forgotPassword(
  request: ForgotPasswordRequest
): Observable<string> {

  return this.http.post(
    `${this.API_URL}/forgot-password`,
    request,
    {
      responseType: 'text'
    }
  );
}

resetPassword(
  request: ResetPasswordRequest
): Observable<string> {

  return this.http.post(
    `${this.API_URL}/reset-password`,
    request,
    {
      responseType: 'text'
    }
  );
}

}
