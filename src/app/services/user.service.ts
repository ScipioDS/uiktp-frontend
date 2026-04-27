// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly TOKEN_KEY = 'jwt-token';
  private readonly API = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getUserInfo() {
    return this.http.get<any>(`${this.API}/info`);
  }
}
