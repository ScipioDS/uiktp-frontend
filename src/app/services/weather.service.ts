import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FullWeatherDataDTO {
  dateTime: string;
  latitude: number;
  longitude: number;
  soilTemperature0cm: number;
  soilTemperature6cm: number;
  soilTemperature18cm: number;
  soilTemperature54cm: number;
  soilMoisture0To1cm: number;
  soilMoisture1To3cm: number;
  soilMoisture3To9cm: number;
  soilMoisture9To27cm: number;
  soilMoisture27To81cm: number;
  precipitationProbability: number;
  rain: number;
  evapotranspiration: number;
  et0FaoEvapotranspiration: number;
  temperature2m: number;
  relativeHumidity2m: number;
  windSpeed10m: number;
  vapourPressureDeficit: number;
  cloudCover: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly API = 'http://localhost:8080/api/weather';

  constructor(private http: HttpClient) {}

  getFromDB(locationId: number): Observable<FullWeatherDataDTO[]> {
    return this.http.get<FullWeatherDataDTO[]>(`${this.API}/full-db/${locationId}`);
  }

  getRefreshed(locationId: number): Observable<FullWeatherDataDTO[]> {
    return this.http.get<FullWeatherDataDTO[]>(`${this.API}/full/${locationId}`);
  }
}
