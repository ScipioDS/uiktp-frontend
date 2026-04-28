import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly TOKEN_KEY = 'jwt-token';
  private readonly API = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getUserInfo() {
    return this.http.get<any>(`${this.API}/info`);
  }

  getUserInfoById(userId: string) {
    return this.http.get<any>(`${this.API}/info/${userId}`);
  }

  updateUser(payload: {
    userId: string;
    username?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
  }) {
    return this.http.post<any>(`${this.API}/update`, payload);
  }
}
