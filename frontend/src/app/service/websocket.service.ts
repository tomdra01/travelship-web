import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket;

  constructor() {
    this.ws = new WebSocket('ws://localhost:8181');
  }

  initWebSocket(username: string, tripId: number, onMessageCallback: (data: any) => void) {
    this.ws.onopen = () => {
      console.log("WebSocket connection established.");
      this.clientSetUsername(username);
      this.clientEnterRoom(tripId);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageCallback(data);
    };

    this.ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };
  }

  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }

  private clientSetUsername(username: string) {
    const object = {
      eventType: "ClientWantsToSetUsername",
      Username: username
    };
    this.ws.send(JSON.stringify(object));
    console.log("Username set to: " + username);
  }

  private clientEnterRoom(roomId: number) {
    const object = {
      eventType: "ClientWantsToEnterRoom",
      roomId: roomId
    };
    this.ws.send(JSON.stringify(object));
  }
}
