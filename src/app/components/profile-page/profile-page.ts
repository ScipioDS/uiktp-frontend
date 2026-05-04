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
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from '../../services/location.service';
import { LocationAddDialogue } from '../location-add-dialogue/location-add-dialogue';
import { WeatherDialog } from '../weather-dialog/weather-dialog';

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

  locations = signal<LandLocation[]>([]);

  currentIndex = signal(0);

  constructor(private dialog: MatDialog, private locationService: LocationService) {
    this.authService.loadUser().subscribe();
  }

  openAddLocation(): void {
    const ref = this.dialog.open(LocationAddDialogue, {
      width: '420px',
      data: { userId: this.user().id },  // pass real userId
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.locationService.create(result).subscribe({
          next: (loc) => {
            this.locations.update(prev => [...prev, new LandLocation(loc.id, loc.name, loc.latitude, loc.longitude)]);
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  deleteLocation(): void {
    const loc = this.currentLocation();
    if (!loc?.id) return;

    this.locationService.delete(loc.id).subscribe({
      next: () => {
        this.locations.update(prev => prev.filter(l => l.id !== loc.id));
        // clamp index so it doesn't go out of bounds
        const newLen = this.locations().length;
        if (this.currentIndex() >= newLen) {
          this.currentIndex.set(Math.max(0, newLen - 1));
        }
      },
      error: (err) => console.error('Failed to delete location', err),
    });
  }

  currentLocation() {
    const locs = this.locations();
    return locs.length > 0 ? locs[this.currentIndex()] : null;
  }

  prevLocation() {
    if (this.currentIndex() > 0) this.currentIndex.update((i) => i - 1);
  }

  nextLocation() {
    if (this.currentIndex() < this.locations().length - 1) this.currentIndex.update((i) => i + 1);
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

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.userService.getUserInfo().subscribe((user) => {
      // load locations once we have the user
      const userId = this.user()?.id;
      if (userId) {
        this.locationService.getByUserId(userId).subscribe({
          next: (locs) => {
            this.locations.set(locs.map(l => new LandLocation(l.id, l.name, l.latitude, l.longitude)));
          },
          error: (err) => console.error('Failed to load locations', err),
        });
      }
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

  openWeather(loc: LandLocation) {
    const ref = this.dialog.open(WeatherDialog, {
      data: { locationId: loc.id, locationName: loc.name },
      width: '900px',
      maxWidth: '95vw',
      panelClass: 'weather-dialog-panel',
    });
  }
}
