import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocationCreationHelper {
  id: number | null;
  latitude: number;
  longitude: number;
  name: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly API = 'http://localhost:8080/api/location';

  constructor(private http: HttpClient) {}

  create(payload: LocationCreationHelper): Observable<any> {
    return this.http.post(`${this.API}/create`, payload);
  }
  getByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/user/${userId}`);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
  getAllPredefined(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/public/location/');
  }
}
