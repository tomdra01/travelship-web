import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TripService} from "../../../service/TripService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-trip',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-trip.component.html',
  styleUrl: './create-trip.component.css'
})
export class CreateTripComponent {

  constructor(private tripService: TripService, private router: Router) {}

  tripForm = new FormGroup({
    name: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    code: new FormControl('')
  });

  onSubmit() {
    if (this.tripForm.valid) {
      const formValue = {...this.tripForm.value};

      if (formValue.code === '') {
        formValue.code = null;
      }

      this.tripService.createTrip(formValue).subscribe({
        next: (trip) => {
          console.log('Trip created successfully:', trip);
          this.router.navigate(['/some-success-route']);  // Adjust the route as necessary
        },
        error: (error) => {
          console.error('Failed to create trip:', error);
          // Handle errors, perhaps show a user-friendly error message
        }
      });
    }
  }
}
