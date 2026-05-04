// auth.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt-token';
  private readonly API = 'http://localhost:8080/api/auth';
  private userService = inject(UserService);

  currentUser = signal<any | null>(null);

  loadUser() {
    if (!this.isLoggedIn()) {
      this.currentUser.set(null);
      return EMPTY;
    }
    return this.userService.getUserInfo().pipe(
      tap(user => this.currentUser.set(user))
    );
  }
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ 'jwt-token': string }>(`${this.API}/login`, { username, password }).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, res['jwt-token']))
    );
  }

  register(user: any) {
    return this.http.post<{ 'jwt-token': string }>(`${this.API}/register`, user).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, res['jwt-token']))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Array.isArray(payload.roles) && payload.roles.includes('ROLE_ADMIN');
    } catch {
      return false;
    }
  }
}
