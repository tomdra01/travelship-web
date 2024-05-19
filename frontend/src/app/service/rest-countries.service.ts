import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestCountriesService {
  private apiUrl = 'http://api.geonames.org/searchJSON';
  private username = 'travelship';

  constructor(private http: HttpClient) {}

  searchCities(query: string): Observable<string[]> {
    if (!query.trim()) {
      // if not search term, return empty city array.
      return of([]);
    }
    const url = `${this.apiUrl}?q=${query}&maxRows=10&cities=cities15000&username=${this.username}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.geonames) {
          return response.geonames.map((city: any) => city.name);
        } else {
          console.error('Invalid response format', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Failed to fetch cities:', error);
        return of([]); // Return an empty array on error
      })
    );
  }
}
