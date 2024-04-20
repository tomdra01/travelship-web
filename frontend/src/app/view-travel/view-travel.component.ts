import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-view-travel',
  standalone: true,
  imports: [],
  templateUrl: './view-travel.component.html',
  styleUrl: './view-travel.component.css'
})
export class ViewTravelComponent {
  tripId: number | undefined;

  constructor(private route: ActivatedRoute) {
    // Get the tripId from the URL
    this.route.params.subscribe(params => {
      this.tripId = +params['tripId'];
    });
  }
}
