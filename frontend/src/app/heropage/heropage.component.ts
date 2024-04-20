import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-heropage',
  standalone: true,
  imports: [],
  templateUrl: './heropage.component.html',
  styleUrl: './heropage.component.css'
})
export class HeropageComponent {
  @ViewChild('publicTrips') publicTripsDiv!: ElementRef<HTMLDivElement>;

  scrollToPublicTrips(): void {
    this.publicTripsDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
