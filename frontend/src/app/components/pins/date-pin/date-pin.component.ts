import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { WebsocketService } from "../../../service/websocket.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-date-pin',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './date-pin.component.html',
  styleUrls: ['./date-pin.component.css']
})
export class DatePinComponent implements OnInit {
  @Input() pin: any;
  @Input() tripInfo: any;

  @Output() pinRemoved = new EventEmitter<number>();
  @Output() dragStarted = new EventEmitter<any>();

  constructor(private websocketService: WebsocketService) { }

  ngOnInit() {
    if (this.pin.description && this.pin.description.trim() !== '') {
      try {
        this.pin.dates = JSON.parse(this.pin.description);
        this.calculateTripStatistics();
      } catch (error) {
        console.error('Failed to parse dates from pin description:', error);
        this.pin.dates = [];
      }
    } else {
      this.pin.dates = [];
    }
  }

  onDragStart(event: MouseEvent): void {
    this.dragStarted.emit({ event, pin: this.pin });
  }

  removePin(): void {
    this.pinRemoved.emit(this.pin.id);
  }

  addDates(): void {
    if (this.pin.departureDate && this.pin.arrivalDate) {
      this.pin.dates.push({ departure: this.pin.departureDate, arrival: this.pin.arrivalDate });
      this.sendPinEdit(this.pin.dates);
      this.calculateTripStatistics();
    }
  }

  sendPinEdit(dates: { departure: string, arrival: string }[]): void {
    this.websocketService.sendMessage({
      eventType: 'ClientWantsToEditPinContent',
      PinId: this.pin.id,
      Description: JSON.stringify(dates),
      TripId: this.pin.tripId,
    });
  }

  calculateTripStatistics(): void {
    const allDates = this.pin.dates.flatMap((date: { departure: string | number | Date; arrival: string | number | Date; }) => [new Date(date.departure), new Date(date.arrival)]);
    const earliestDate = new Date(Math.min(...allDates.map((date: { getTime: () => any; }) => date.getTime())));
    const latestDate = new Date(Math.max(...allDates.map((date: { getTime: () => any; }) => date.getTime())));
    const averageDate = new Date(allDates.reduce((sum: any, date: { getTime: () => any; }) => sum + date.getTime(), 0) / allDates.length);

    this.pin.earliestDate = earliestDate.toISOString().split('T')[0];
    this.pin.latestDate = latestDate.toISOString().split('T')[0];
    this.pin.averageDate = averageDate.toISOString().split('T')[0];
  }
}
