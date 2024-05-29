import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TripService } from "../../service/TripService";
import { RestCountriesService } from "../../service/rest-countries.service";
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from "rxjs";
import {UnsplashService} from "../../service/unsplash.service";
import {LanguageService} from "../../service/language.service";

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']  // Corrected styleUrl to styleUrls
})
export class CreateTripComponent implements OnInit {
  tripForm: FormGroup;
  filteredCities: Observable<string[]> = of([]);
  locationControl = new FormControl('', Validators.required);
  imageUrl: string | null | undefined;

  constructor(
    private tripService: TripService,
    private router: Router,
    private unsplashService: UnsplashService,
    private restCountriesService: RestCountriesService,
    private languageService: LanguageService
  ) {
    this.tripForm = new FormGroup({
      name: new FormControl('', Validators.required),
      location: this.locationControl,
      date: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      code: new FormControl('')
    });

    this.languageService.initializeLanguage();
  }

  ngOnInit() {
    this.filteredCities = this.locationControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.restCountriesService.searchCities(term) : of([]))
    );

    this.loadImage();
  }

  loadImage() {
    this.unsplashService.getRandomPhoto().subscribe({
      next: (url) => {
        if (url) {
          console.log('Image URL received:', url);
          this.imageUrl = url;
        } else {
          console.log('No URL received, possibly due to an error.');
        }
      },
      error: (error) => {
        console.error('Failed to load image from Unsplash', error);
      }
    });
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formValue = { ...this.tripForm.value };
      formValue.code = formValue.code === '' ? null : formValue.code;

      this.tripService.createTrip(formValue).subscribe({
        next: (trip) => {
          console.log('Trip created successfully:', trip);
          this.router.navigate(['/travel/'+trip.id]);
        },
        error: (error) => {
          console.error('Failed to create trip:', error);
        }
      });
    }
  }
}
