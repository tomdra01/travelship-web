import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {GoogleApiService, UserInfo} from "../../../service/google-api.service";
import {HeropageComponent} from "../heropage/heropage.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule, HeropageComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

  constructor(private router: Router) {
  }
  clickOpenTrip(tripId: number) {
    this.router.navigate(['travel', tripId]);
  }

  //SAMPLE TRIPS
  trips = [
    {
      tripId: 1,
      tripName: 'Mountain Adventure',
      description: 'Explore the heights with this thrilling mountain adventure.',
      location: 'Rocky Mountains',
      date: '2025-07-15',
      peopleJoined: 24
    },
    {
      tripId: 2,
      tripName: 'Beachside Escape',
      description: 'Relax on the sands and soak up the sun with our beachside escape.',
      location: 'Maldives',
      date: '2025-08-01',
      peopleJoined: 16
    },
    {
      tripId: 3,
      tripName: 'City Tour',
      description: 'Experience the hustle and bustle of the city with our city tour.',
      location: 'New York City',
      date: '2025-09-12',
      peopleJoined: 4
    },
    {
      tripId: 4,
      tripName: 'Safari Adventure',
      description: 'Get up close and personal with the wildlife on our safari adventure.',
      location: 'Serengeti',
      date: '2025-10-05',
      peopleJoined: 8
    }
  ];
}
