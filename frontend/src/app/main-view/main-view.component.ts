import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

  //SAMPLE TRIPS
  trips = [
    {
      tripName: 'Mountain Adventure',
      description: 'Explore the heights with this thrilling mountain adventure.',
      location: 'Rocky Mountains',
      peopleJoined: 24
    },
    {
      tripName: 'Beachside Escape',
      description: 'Relax on the sands and soak up the sun with our beachside escape.',
      location: 'Maldives',
      peopleJoined: 16
    },
  ];
}
