import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {HeropageComponent} from "../heropage/heropage.component";
import {Router} from "@angular/router";
import {TripService} from "../../service/TripService";
import {TranslateModule} from "@ngx-translate/core";
import {LanguageService} from "../../service/language.service";

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule, HeropageComponent, TranslateModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit {
  trips: any[] = [];

  constructor(private tripService: TripService, private router: Router, private languageService: LanguageService) {}

  ngOnInit(): void {
    this.loadTrips();
    this.languageService.initializeLanguage();
  }

  loadTrips(): void {
    this.tripService.getPublicTrips().subscribe({
      next: (data: any[]) => {
        this.trips = data;  // Set the trips data with response from the server
      },
      error: (error: any) => {
        console.error('Failed to load trips:', error);
        // Handle errors here, possibly show a user-friendly message
      }
    });
  }

  clickOpenTrip(tripId: number): void {
    if (tripId) {
      this.router.navigate(['travel', tripId]);
    } else {
      console.error('Invalid trip ID:', tripId);
      // Handle invalid trip ID, possibly show a user-friendly message
    }
  }
}
