import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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
  private readonly BASE_URL = 'http://localhost:8080/api';

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
    return this.http.get<any[]>(`${this.BASE_URL}/public/location/`);
  }
  importExcel(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string }>(`${this.BASE_URL}/import/excel`, formData)
      .pipe(map(res => res.message));
  }
}
