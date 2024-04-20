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
      peopleJoined: 24
    },
    {
      tripId: 2,
      tripName: 'Beachside Escape',
      description: 'Relax on the sands and soak up the sun with our beachside escape.',
      location: 'Maldives',
      peopleJoined: 16
    },
  ];
}
