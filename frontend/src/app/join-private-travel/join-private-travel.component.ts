import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-join-private-travel',
  standalone: true,
  imports: [],
  templateUrl: './join-private-travel.component.html',
  styleUrl: './join-private-travel.component.css'
})
export class JoinPrivateTravelComponent {
  tripId: number = 1;

  constructor(private router: Router) {
    // TODO Get the tripId from the entered code
  }

  submitCode() {
    this.router.navigate(['travel', this.tripId]);
    // TODO Finish routing to the correct private travel
  }
}
