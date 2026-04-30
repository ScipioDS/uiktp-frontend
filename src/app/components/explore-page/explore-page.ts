import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../header/header';
import { LocationService } from '../../services/location.service';
import { LandLocation } from '../../model/location';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {WeatherDialog} from '../weather-dialog/weather-dialog';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-explore-page',
  imports: [Header, MatCardModule, MatIconModule, MatIconButton],
  templateUrl: './explore-page.html',
  styleUrl: './explore-page.css',
})
export class ExplorePage implements OnInit {
  private locationService = inject(LocationService);
  locations = signal<LandLocation[]>([]);

  ngOnInit(): void {
    this.locationService.getAllPredefined().subscribe({
      next: (locs) => {
        this.locations.set(
          locs.map((l) => new LandLocation(l.id, l.name, l.latitude, l.longitude)),
        );
      },
      error: (err) => console.error('Failed to load locations', err),
    });
  }

  constructor(private dialog: MatDialog) {}

  openWeather(loc: LandLocation) {
    const ref = this.dialog.open(WeatherDialog, {
      data: { locationId: loc.id, locationName: loc.name },
      width: '900px',
      maxWidth: '95vw',
      panelClass: 'weather-dialog-panel',
    });
  }
}
