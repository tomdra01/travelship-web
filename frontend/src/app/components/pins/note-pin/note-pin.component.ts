import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebsocketService} from "../../../service/websocket.service";

@Component({
  selector: 'app-note-pin',
  standalone: true,
  imports: [],
  templateUrl: './note-pin.component.html',
  styleUrl: './note-pin.component.css'
})
export class NotePinComponent implements OnInit{
  @Input() pin: any;
  @Input() tripInfo: any;

  @Output() pinRemoved = new EventEmitter<number>();
  @Output() dragStarted = new EventEmitter<{ event: MouseEvent, pin: any }>();

  private debouncedEditPinContent: (editedContent: string) => void;

  private debounce(func: Function, wait: number) {
    let timeout: any;
    return (...args: any[]) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  constructor(private websocketService: WebsocketService) {
    this.debouncedEditPinContent = this.debounce(this.editPinContent.bind(this), 300);  }

  ngOnInit() {
    this.initWebSocket();
  }

  private initWebSocket() {
    //this.websocketService.initWebSocket(this.userDetailsService.username!, this.tripId!);
    this.websocketService.messages.subscribe((data) => {
      this.handleWebSocketEvent(data);
    });
  }

  private handleWebSocketEvent(data: any) {
    switch (data.eventType) {
      case 'ServerEditsPinContent':
        this.editContent(data.PinId, data.Description, data.Username);
        break;
    }
  }

  private editPinContent(editedContent: string) {
    this.websocketService.sendMessage({
      eventType: 'ClientWantsToEditPinContent',
      PinId: this.pin.id,
      Description: editedContent,
      TripId: this.tripInfo.id!,
    });
  }

  private editContent(pinId: number, description: string, username: string) {
    if (this.pin.id === pinId) {
      this.pin.description = description;
      //this.pin.username = username;
    }

  }

  onDragStart(event: MouseEvent): void {
    this.dragStarted.emit({ event, pin: this.pin });
  }

  removePin(): void {
    this.pinRemoved.emit(this.pin.id);
  }

  onContentChange(event: any): void {
    this.debouncedEditPinContent(event.target.value);
  }
}
