import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-note-pin',
  standalone: true,
  imports: [],
  templateUrl: './note-pin.component.html',
  styleUrl: './note-pin.component.css'
})
export class NotePinComponent {
  @Input() pin: any;
  @Output() pinRemoved = new EventEmitter<number>();
  @Output() dragStarted = new EventEmitter<{ event: MouseEvent, pin: any }>();

  onDragStart(event: MouseEvent): void {
    this.dragStarted.emit({ event, pin: this.pin });
  }

  removePin(): void {
    this.pinRemoved.emit(this.pin.id);
  }
}
