import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../header/header';
import { LocationService } from '../../services/location.service';
import { LandLocation } from '../../model/location';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-explore-page',
  imports: [Header, MatCardModule, MatIconModule],
  templateUrl: './explore-page.html',
  styleUrl: './explore-page.css',
})
export class ExplorePage implements OnInit {
  private locationService = inject(LocationService);
  locations = signal<LandLocation[]>([]);

  ngOnInit(): void {
    this.locationService.getAllPredefined().subscribe({
      next: (locs) => {
        this.locations.set(locs.map(l => new LandLocation(l.id, l.name, l.latitude, l.longitude)));
      },
      error: (err) => console.error('Failed to load locations', err),
    });
  }
}
