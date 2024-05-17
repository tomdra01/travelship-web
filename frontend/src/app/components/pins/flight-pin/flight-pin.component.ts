import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlightService} from "../../../service/flight.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-flight-pin',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './flight-pin.component.html',
  styleUrl: './flight-pin.component.css'
})
export class FlightPinComponent {

  constructor(private flightService: FlightService) { }

  @Input() pin: any;
  @Input() tripInfo: any;

  @Output() pinRemoved = new EventEmitter<number>();
  @Output() dragStarted = new EventEmitter<any>();

  fromCity: string = '';

  onDragStart(event: MouseEvent): void {
    this.dragStarted.emit({ event, pin: this.pin });
  }

  removePin(): void {
    this.pinRemoved.emit(this.pin.id);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateTicket() {
    if (this.tripInfo) {
      const formattedDate = this.formatDate(this.tripInfo.date);
      this.flightService.getCheapestOneWayFlight(this.fromCity, this.tripInfo.location, formattedDate).subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.error('Error:', error);
          alert('Error, failed to find flights');
        }
      );
    } else {
      console.error('No trip info provided');
    }
  }


}
