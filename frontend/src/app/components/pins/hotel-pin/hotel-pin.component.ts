import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-hotel-pin',
  standalone: true,
  imports: [],
  templateUrl: './hotel-pin.component.html',
  styleUrl: './hotel-pin.component.css'
})
export class HotelPinComponent {
  @Input() pin: any;
  @Input() tripInfo: any;

  @Output() pinRemoved = new EventEmitter<number>();
  @Output() dragStarted = new EventEmitter<any>();

  onDragStart(event: MouseEvent): void {
    this.dragStarted.emit({ event, pin: this.pin });
  }

  removePin(): void {
    this.pinRemoved.emit(this.pin.id);
  }
}
