import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlightService } from "../../../service/flight.service";
import { FormsModule } from "@angular/forms";
import { FlightData } from "../../../../../models/Flight";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { WebsocketService } from "../../../service/websocket.service";
import {LanguageService} from "../../../service/language.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-flight-pin',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './flight-pin.component.html',
  styleUrls: ['./flight-pin.component.css']
})
export class FlightPinComponent implements OnInit {

  @Input() pin: any;
  @Input() tripInfo: any;
  @Output() pinRemoved = new EventEmitter<number>();
  @Output() dragStarted = new EventEmitter<any>();

  fromCity: string = '';
  flightData: { day: string; group: string; price: number; }[] = [];
  showFlights: boolean = false;

  constructor(private websocketService: WebsocketService, private flightService: FlightService, private languageService: LanguageService) {
    this.languageService.initializeLanguage();
  }

  ngOnInit() {
    if (!this.pin.description || this.pin.description.trim() === '') {
      this.showFlights = false;
    } else {
      try {
        this.flightData = JSON.parse(this.pin.description);
        this.showFlights = true;
      } catch (error) {
        console.error('Failed to parse flight data JSON:', error);
        this.showFlights = false;
      }
    }
  }

  onDragStart(event: MouseEvent): void {
    this.dragStarted.emit({ event, pin: this.pin });
  }

  removePin(): void {
    this.pinRemoved.emit(this.pin.id);
  }

  sendPinEdit(flightData: { day: string; group: string; price: number; }[]): void {
    this.websocketService.sendMessage({
      eventType: 'ClientWantsToEditPinContent',
      PinId: this.pin.id,
      Description: JSON.stringify(flightData),
      TripId: this.tripInfo.id,
    });
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

      if (typeof this.tripInfo.location !== 'string') {
        console.error('Invalid data types for from city, location, or date.');
        return;
      }

      this.flightService.getCheapestOneWayFlight(this.fromCity, this.tripInfo.location, formattedDate).subscribe(
        (response) => {
          console.log('Flight data:', response);
          this.flightData = response.data.sort((a, b) => a.price - b.price).slice(0, 5); // Get the 5 cheapest flights
          this.showFlights = true;
          this.sendPinEdit(this.flightData);
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
