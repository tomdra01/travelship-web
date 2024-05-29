import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environment/Environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket;
  private messageSubject = new Subject<any>();

  constructor() {
    this.ws = new WebSocket(environment.websocketUrl);
  }

  initWebSocket(username: string, tripId: number) {
    this.ws.onopen = () => {
      console.log('WebSocket connection established.');
      this.clientSetUsername(username);
      this.clientWantsToEnterTrip(tripId);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageSubject.next(data);
    };

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  get messages() {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }

  private clientSetUsername(username: string) {
    const object = {
      eventType: 'ClientWantsToSetUsername',
      Username: username,
    };
    this.ws.send(JSON.stringify(object));
    console.log('Username set to: ' + username);
  }

  private clientWantsToEnterTrip(tripId: number) {
    const object = {
      eventType: 'ClientWantsToEnterTrip',
      tripId: tripId,
    };
    this.ws.send(JSON.stringify(object));
  }
}
