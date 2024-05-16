import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-date-pin',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './date-pin.component.html',
  styleUrl: './date-pin.component.css'
})
export class DatePinComponent {
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
