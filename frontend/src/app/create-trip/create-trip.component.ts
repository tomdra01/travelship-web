import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

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
  tripForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.tripForm.valid) {
      console.log(this.tripForm.value);
    }
  }
}
