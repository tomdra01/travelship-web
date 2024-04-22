import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environment/Environment";
import {Trip} from "../models/Trip";

@Injectable({
  providedIn: 'root'
})
export class TripService {
  constructor(private http: HttpClient) {
  }

  getTrips(): Observable<Trip[]> {
    const url = `${environment.baseUrl}/api/trips`;
    return this.http.get<any[]>(url);
  }

  getTripById(id: number): Observable<Trip> {
    const url = `${environment.baseUrl}/api/trips/${id}`;
    return this.http.get<any>(url);
  }

  createTrip(tripData: FormData): Observable<any> {
    const url = `${environment.baseUrl}/api/trips`;
    return this.http.post(url, tripData);
  }

  updateTrip(id: number, tripData: FormData): Observable<any> {
    const url = `${environment.baseUrl}/api/trips/${id}`;
    return this.http.put(url, tripData);
  }

  deleteTrip(id: number): Observable<any> {
    const url = `${environment.baseUrl}/api/trips/${id}`;
    return this.http.delete(url);
  }
}
