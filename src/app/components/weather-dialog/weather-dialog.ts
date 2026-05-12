import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartConfiguration, ChartData } from 'chart.js';
import { FullWeatherDataDTO, WeatherService } from '../../services/weather.service';
import { BaseChartDirective } from 'ng2-charts';
import { IrrigationPrediction, IrrigationService } from '../../services/irrigation.service';
import { DatePipe, DecimalPipe, KeyValuePipe } from '@angular/common';

export interface WeatherDialogData {
  locationId: number;
  locationName: string;
}

@Component({
  selector: 'app-weather-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    DatePipe,
    KeyValuePipe,
    DecimalPipe,
  ],
  templateUrl: './weather-dialog.html',
  styleUrl: './weather-dialog.css',
})
export class WeatherDialog implements OnInit {
  loading = signal(false);
  error = signal<string | null>(null);
  weatherService = inject(WeatherService);
  irrigationService = inject(IrrigationService);
  irrigation = signal<IrrigationPrediction | null>(null);
  irrigationError = signal<string | null>(null);

  labels: string[] = [];
  tempChartData!: ChartData<'line'>;
  soilTempChartData!: ChartData<'line'>;
  moistureChartData!: ChartData<'line'>;
  windRainChartData!: ChartData<'bar'>;

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { ticks: { maxTicksLimit: 12, maxRotation: 45 } },
      y1: { position: 'right', grid: { drawOnChartArea: false } },
    },
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { ticks: { maxTicksLimit: 12, maxRotation: 45 } },
      y1: { position: 'right', grid: { drawOnChartArea: false } },
    },
  };

  constructor(
    public dialogRef: MatDialogRef<WeatherDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WeatherDialogData,
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadIrrigation();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);
    this.weatherService.getFromDB(this.data.locationId).subscribe({
      next: (data) => {
        this.buildCharts(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load weather data.');
        this.loading.set(false);
      },
    });
  }

  loadIrrigation() {
    this.irrigationError.set(null);
    this.irrigationService.getLatest(this.data.locationId).subscribe({
      next: (data) => this.irrigation.set(data),
      error: () => this.irrigationError.set('Failed to load irrigation prediction.'),
    });
  }

  refresh() {
    this.loading.set(true);
    this.error.set(null);
    this.weatherService.getRefreshed(this.data.locationId).subscribe({
      next: (data) => {
        this.buildCharts(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to refresh weather data.');
        this.loading.set(false);
      },
    });
  }

  private buildCharts(data: FullWeatherDataDTO[]) {
    this.labels = data.map((d, i) =>
      i % 3 === 0
        ? new Date(d.dateTime).toLocaleString('en', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
          })
        : '',
    );

    this.tempChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Temp 2m (°C)',
          data: data.map((d) => d.temperature2m),
          borderColor: '#e53935',
          backgroundColor: 'rgba(229,57,53,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: 'Humidity (%)',
          data: data.map((d) => d.relativeHumidity2m),
          borderColor: '#1e88e5',
          backgroundColor: 'rgba(30,136,229,0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          yAxisID: 'y1',
        },
        {
          label: 'Cloud Cover (%)',
          data: data.map((d) => d.cloudCover),
          borderColor: '#90a4ae',
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          yAxisID: 'y1',
        },
      ],
    };

    this.soilTempChartData = {
      labels: this.labels,
      datasets: [
        {
          label: '0cm (°C)',
          data: data.map((d) => d.soilTemperature0cm),
          borderColor: '#ef6c00',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '6cm (°C)',
          data: data.map((d) => d.soilTemperature6cm),
          borderColor: '#f9a825',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '18cm (°C)',
          data: data.map((d) => d.soilTemperature18cm),
          borderColor: '#558b2f',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '54cm (°C)',
          data: data.map((d) => d.soilTemperature54cm),
          borderColor: '#1565c0',
          tension: 0.4,
          pointRadius: 2,
        },
      ],
    };

    this.moistureChartData = {
      labels: this.labels,
      datasets: [
        {
          label: '0-1cm',
          data: data.map((d) => d.soilMoisture0To1cm),
          borderColor: '#00acc1',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '1-3cm',
          data: data.map((d) => d.soilMoisture1To3cm),
          borderColor: '#00897b',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '3-9cm',
          data: data.map((d) => d.soilMoisture3To9cm),
          borderColor: '#43a047',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '9-27cm',
          data: data.map((d) => d.soilMoisture9To27cm),
          borderColor: '#7b1fa2',
          tension: 0.4,
          pointRadius: 2,
        },
        {
          label: '27-81cm',
          data: data.map((d) => d.soilMoisture27To81cm),
          borderColor: '#6d4c41',
          tension: 0.4,
          pointRadius: 2,
        },
      ],
    };

    this.windRainChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Wind 10m (km/h)',
          data: data.map((d) => d.windSpeed10m),
          backgroundColor: 'rgba(66,165,245,0.7)',
          yAxisID: 'y',
        },
        {
          label: 'Rain (mm)',
          data: data.map((d) => d.rain),
          backgroundColor: 'rgba(38,198,218,0.7)',
          yAxisID: 'y1',
        },
        {
          label: 'Precip. Prob. (%)',
          data: data.map((d) => d.precipitationProbability * 100),
          backgroundColor: 'rgba(149,117,205,0.7)',
          yAxisID: 'y1',
        },
      ],
    };
  }

  export() {
    this.weatherService.exportWeatherData(this.data.locationId);
  }
}
