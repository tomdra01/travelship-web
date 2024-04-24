import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-heropage',
  standalone: true,
  imports: [],
  templateUrl: './heropage.component.html',
  styleUrl: './heropage.component.css'
})
export class HeropageComponent {
  @ViewChild('publicTrips') publicTripsDiv!: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {
  }

  scrollToPublicTrips(): void {
    this.publicTripsDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  clickPlanTrip() {
    this.router.navigate(['create']);
  }

  clickJoinTravel() {
    this.router.navigate(['join']);
  }
}
