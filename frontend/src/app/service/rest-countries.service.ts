import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestCountriesService {
  private apiUrl = 'https://restcountries.com/v3.1/name'; // Base URL for the REST Countries API

  constructor(private http: HttpClient) {}

  searchCountries(query: string): Observable<string[]> {
    if (!query.trim()) {
      // if not search term, return empty country array.
      return of([]);
    }
    return this.http.get<any[]>(`${this.apiUrl}/${query}?fields=name`).pipe(
      map(countries => countries.map(country => country.name.common)),
      catchError(error => {
        console.error('Failed to fetch countries:', error);
        return of([]); // Return an empty array on error
      })
    );
  }
}
