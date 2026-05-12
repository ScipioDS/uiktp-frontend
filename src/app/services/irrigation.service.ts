import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IrrigationPrediction {
  location_id: number;
  record_id: number;
  date_time: string;
  irrigation_category: string;
  water_amount_mm: number;
  features: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class IrrigationService {
  private readonly API = 'http://localhost:8080/api/ml';

  constructor(private http: HttpClient) {}

  getLatest(locationId: number): Observable<IrrigationPrediction> {
    return this.http.get<IrrigationPrediction>(`${this.API}/latest/${locationId}`);
  }
}
