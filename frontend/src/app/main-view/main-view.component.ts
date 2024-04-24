import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {HeropageComponent} from "../heropage/heropage.component";
import {Router} from "@angular/router";
import {TripService} from "../../../service/TripService";

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule, HeropageComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit {

  trips: any[] = [];

  constructor(private tripService: TripService, private router: Router) {
  }
  clickOpenTrip(tripId: number) {
    this.router.navigate(['travel', tripId]);
  }

  loadTrips(): void {
    this.tripService.getPublicTrips().subscribe({
      next: (data) => {
        this.trips = data;  // Set the trips data with response from the server
      },
      error: (error) => {
        console.error('Failed to load trips:', error);
        // Handle errors here, possibly show a user-friendly message
      }
    });
  }


  ngOnInit(): void {
    this.loadTrips();
  }
}
