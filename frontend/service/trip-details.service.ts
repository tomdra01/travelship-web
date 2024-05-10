import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Trip } from '../models/Trip';
import { TripService } from './TripService';

@Injectable({
  providedIn: 'root'
})
export class TripDetailsService {
  private tripInfoSubject: BehaviorSubject<Trip | null> = new BehaviorSubject<Trip | null>(null);
  tripInfo$: Observable<Trip | null> = this.tripInfoSubject.asObservable();

  constructor(private tripService: TripService) {}

  loadTripDetails(tripId: number): Observable<Trip | null> {
    return new Observable<Trip | null>((observer) => {
      this.tripService.getTripById(tripId).subscribe({
        next: (trip: Trip) => {
          this.tripInfoSubject.next(trip);
          observer.next(trip);
        },
        error: (error: any) => { // Specify the type of error parameter
          console.error('Failed to load trip details:', error);
          observer.error(error);
        }
      });
    });
  }
}
