import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environment/Environment";
import {FlightResponse} from "../../../models/Flight";

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient) { }

  getCheapestOneWayFlight(fromCity: string, toCity: string, departDate: string): Observable<FlightResponse> {
    const url = `${environment.httpUrl}/api/Flight/cheapest-one-way?fromCity=${fromCity}&toCity=${toCity}&departDate=${departDate}`;
    return this.http.get<FlightResponse>(url);  }
}
