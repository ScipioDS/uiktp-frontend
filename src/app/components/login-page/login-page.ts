import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatError,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  public loginForm!: UntypedFormGroup;
  public registerForm!: UntypedFormGroup;
  private fb = inject(UntypedFormBuilder);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.initLoginForm();
    this.initRegisterForm();
  }

  ngOnInit() {}

  initLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  initRegisterForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required],
    });
  }

  doLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: () => this.router.navigate(['/explore']),
        error: (err) => console.error('Login failed', err),
      });
    }
  }

  doRegister() {
    if (this.registerForm.valid) {
      const { email, password, username } = this.registerForm.value;

      const registerDTO = {
        email,
        password,
        username,
      };

      this.authService.register(registerDTO).subscribe({
        next: () => this.router.navigate(['/explore']),
        error: (err) => console.error('Register failed', err),
      });
    }
  }
}
