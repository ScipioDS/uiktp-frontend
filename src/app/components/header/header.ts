import { Component, inject } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  authService = inject(AuthService);
  router = inject(Router);
  user = this.authService.currentUser;

  constructor() {
    this.authService.loadUser().subscribe();
  }
  logout() {
    this.authService.logout();
    this.authService.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
