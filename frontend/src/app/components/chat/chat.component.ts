import {Component, Input, OnInit} from '@angular/core';
import {WebsocketService} from "../../service/websocket.service";
import {UserDetailsService} from "../../service/user-details.service";
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  @Input() tripId: number | undefined;
  messageContent: string = '';
  messages: {
    text: string;
    username: string;
    fromUser: boolean;
    flagUrl?: string;
  }[] = [];

  constructor(
    private websocketService: WebsocketService,
    private userDetailsService: UserDetailsService
  ) {}

  ngOnInit(): void {
    this.websocketService.initWebSocket(this.userDetailsService.username!, this.tripId!);
    this.websocketService.messages.subscribe((data) => {
      this.handleWebSocketEvent(data);
    });
  }

  private handleWebSocketEvent(data: any) {
    if (data.eventType === 'ServerAddsClientToTrip') {
      data.Messages.forEach((msg: { Id: number, MessageContent: string, Username: string, TripId: number }) => {
        this.messages.push({
          text: msg.MessageContent,
          username: msg.Username,
          fromUser: msg.Username === this.userDetailsService.username,
          flagUrl: msg.Username === this.userDetailsService.username ? this.userDetailsService.flagUrl : undefined,
        });
      });
    } else if (data.eventType === 'ServerBroadcastsMessageWithUsername') {
      this.messages.push({
        text: data.message,
        username: data.username,
        fromUser: data.username === this.userDetailsService.username,
        flagUrl: data.username === this.userDetailsService.username ? this.userDetailsService.flagUrl : undefined,
      });
    }
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      const message = {
        eventType: 'ClientWantsToBroadcastToTrip',
        tripId: this.tripId!,
        message: this.messageContent,
      };
      this.websocketService.sendMessage(message);
      this.messageContent = '';
    }
  }

  trackById(index: number, message: any): any {
    return message.id;
  }
}
