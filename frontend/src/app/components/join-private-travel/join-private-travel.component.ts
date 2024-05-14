import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {TripService} from "../../service/TripService";

@Component({
  selector: 'app-join-private-travel',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './join-private-travel.component.html',
  styleUrl: './join-private-travel.component.css'
})
export class JoinPrivateTravelComponent {
  tripId: number | undefined;
  code: string = '';

  constructor(private router: Router, private tripService: TripService) {
    // TODO Get the tripId from the entered code
  }

  submitCode(): void {
    if (!this.code) {
      alert("Please enter a code.");
      return;
    }
    this.tripService.getTripByCode(this.code).subscribe({
      next: (trip) => {
        if (trip && trip.id) {
          this.router.navigate(['travel', trip.id]);
        } else {
          alert("No trip found with the provided code.");
        }
      },
      error: () => {
        alert("Failed to find a trip with the provided code.");
      }
    });
  }
}
