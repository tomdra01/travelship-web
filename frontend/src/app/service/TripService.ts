import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environment/Environment";
import {Trip} from "../../../models/Trip";
import {FormControl, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";

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

  getPublicTrips(): Observable<Trip[]> {
    const url = `${environment.baseUrl}/api/trips/public`;
    return this.http.get<Trip[]>(url);
  }

  getTripById(id: number): Observable<Trip> {
    const url = `${environment.baseUrl}/api/trips/${id}`;
    return this.http.get<any>(url);
  }

  getTripByCode(code: string): Observable<Trip> {
    const url = `${environment.baseUrl}/api/trips/bycode/${code}`;
    return this.http.get<any>(url);
  }

  createTrip(tripData: ɵTypedOrUntyped<{
    date: FormControl<string | null>;
    code: FormControl<string | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    location: FormControl<string | null>
  }, ɵFormGroupValue<{
    date: FormControl<string | null>;
    code: FormControl<string | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    location: FormControl<string | null>
  }>, any>): Observable<Trip> {
    const url = `${environment.baseUrl}/api/trips`;
    return this.http.post<Trip>(url, tripData);
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
