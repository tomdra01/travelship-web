import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LanguageService} from "../../service/language.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-heropage',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './heropage.component.html',
  styleUrl: './heropage.component.css'
})
export class HeropageComponent {
  @ViewChild('publicTrips') publicTripsDiv!: ElementRef<HTMLDivElement>;

  constructor(private router: Router, private languageService: LanguageService) {
    this.languageService.initializeLanguage();
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
