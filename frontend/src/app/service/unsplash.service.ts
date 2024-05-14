import { Injectable } from '@angular/core';
import {Observable, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../environment/Environment";

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
    private baseUrl = `${environment.baseUrl}/api/unsplash/random`;

    constructor(private http: HttpClient) {}

    getRandomPhoto(): Observable<string | null> {
        return this.http.get<{imageUrl: string}>(this.baseUrl)
            .pipe(
                map(response => response.imageUrl),
                catchError(error => {
                    console.error('Error fetching photo:', error);
                    return throwError(() => new Error('Error fetching photo from backend'));
                })
            );
    }
}
