import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { Header } from '../header/header';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { PasswordGroupValidator } from '../../util/password.group.validator';
import { LandLocation } from '../../model/location';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile-page',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    Header,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatAccordion,
    PasswordGroupValidator,
    MatIcon,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  locations: LandLocation[] = [
    new LandLocation('Central Park', 40.785091, -73.968285),
    new LandLocation('Eiffel Tower', 48.85837, 2.294481),
    new LandLocation('Colosseum', 41.890251, 12.492373),
    new LandLocation('Machu Picchu', -13.163141, -72.544963),
  ];

  currentIndex = signal(0);

  currentLocation() {
    return this.locations[this.currentIndex()];
  }

  prevLocation() {
    if (this.currentIndex() > 0) this.currentIndex.update((i) => i - 1);
  }

  nextLocation() {
    if (this.currentIndex() < this.locations.length - 1) this.currentIndex.update((i) => i + 1);
  }

  id: string | null | undefined;
  user = this.authService.currentUser;

  form = {
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  };

  successMessage = signal('');
  errorMessage = signal('');

  constructor() {
    this.authService.loadUser().subscribe();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserInfo().subscribe((user) => {
      console.log(user);
      // pre-fill form if you want:
      // this.form.username = user.username;
      // this.form.email = user.email;
    });
  }

  onSubmit() {
    if (!this.id) return;
    if (this.form.newPassword && !this.form.oldPassword) return;

    this.successMessage.set('');
    this.errorMessage.set('');

    const payload: any = { userId: this.id };

    if (this.form.username) payload.username = this.form.username;
    if (this.form.email) payload.email = this.form.email;
    if (this.form.oldPassword) payload.oldPassword = this.form.oldPassword;
    if (this.form.newPassword) payload.newPassword = this.form.newPassword;

    this.userService.updateUser(payload).subscribe({
      next: () => this.successMessage.set('Profile updated successfully.'),
      error: () => this.errorMessage.set('Update failed. Please try again.'),
    });
  }
}
