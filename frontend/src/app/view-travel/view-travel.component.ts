import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-view-travel',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './view-travel.component.html',
  styleUrl: './view-travel.component.css'
})
export class ViewTravelComponent {
  tripId: number | undefined;
  tripInfo: any;

  constructor(private route: ActivatedRoute) {
    // Get the tripId from the URL
    this.route.params.subscribe(params => {
      this.tripId = +params['tripId'];
    });
  }
}
