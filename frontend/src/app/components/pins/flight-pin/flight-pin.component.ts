import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-flight-pin',
  standalone: true,
  imports: [],
  templateUrl: './flight-pin.component.html',
  styleUrl: './flight-pin.component.css'
})
export class FlightPinComponent {
  @Input() pin: any;
  @Output() pinRemoved = new EventEmitter<number>();
  @Output() dragStarted = new EventEmitter<any>();

  onDragStart(event: MouseEvent): void {
    this.dragStarted.emit({ event, pin: this.pin });
  }

  removePin(): void {
    this.pinRemoved.emit(this.pin.id);
  }
}
