import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WebsocketService } from "src/app/service/websocket.service";
import { TripDetailsService } from "src/app/service/trip-details.service";
import { UserDetailsService } from "src/app/service/user-details.service";
import {Trip} from "../../../../models/Trip";
import {DateSelection, Pin} from "../../../../models/Pin";
import { v4 as uuidv4 } from 'uuid';
import {NotePinComponent} from "../pins/note-pin/note-pin.component";
import {HotelPinComponent} from "../pins/hotel-pin/hotel-pin.component";
import {DatePinComponent} from "../pins/date-pin/date-pin.component";
import {FlightPinComponent} from "../pins/flight-pin/flight-pin.component";

@Component({
  selector: 'app-view-travel',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NotePinComponent,
    HotelPinComponent,
    DatePinComponent,
    FlightPinComponent
  ],
  templateUrl: './view-travel.component.html',
  styleUrl: './view-travel.component.css'
})
export class ViewTravelComponent implements OnInit {
  tripId: number | undefined;
  tripInfo: any;
  username?: string;
  picture?: string;
  flagUrl: string | undefined;
  messageContent: string = '';
  messages: { text: string, username: string, fromUser: boolean, flagUrl?: string }[] = [];

  pinOptions = ['NotePin', 'HotelPin', 'FlightTicketPin', 'TripDatePin'];
  selectedOption = this.pinOptions[0];

  pins: Pin[] = [];

  currentPin: any = null;
  offsetX: number = 0;
  offsetY: number = 0;
  dragging: boolean = false;

  @ViewChild('pinboard', {static: true}) pinboard!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websocketService: WebsocketService,
    private tripDetailsService: TripDetailsService,
    private userDetails: UserDetailsService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tripId = +params['tripId'];
      if (this.tripId) {
        this.loadTripDetails(this.tripId);
      }
    });

    this.setUserDetails();
    this.initWebSocket();
  }

  private setUserDetails() {
    this.userDetails.getUserDetails();
    this.username = this.userDetails.username;
    this.picture = this.userDetails.picture;
    this.flagUrl = this.userDetails.flagUrl;
  }

  loadTripDetails(tripId: number) {
    this.tripDetailsService.loadTripDetails(tripId).subscribe({
      next: (trip: Trip | null) => {
        this.tripInfo = trip;
        if (!this.tripInfo) {
          this.router.navigate(['notfound']);
        }
      },
      error: (error: any) => {
        console.error('Failed to load trip details:', error);
        this.router.navigate(['notfound']);
      }
    });
  }

  private initWebSocket() {
    this.websocketService.initWebSocket(this.username!, this.tripId!, (data) => {
      switch (data.eventType) {
        case 'ServerBroadcastsMessageWithUsername':
          this.messages.push({
            text: data.message,
            username: data.username,
            fromUser: data.username === this.username,
            flagUrl: data.username === this.username ? this.flagUrl : undefined
          });
          break;
        case 'ServerAddsPin':
          this.addPinServer(data);
          break;
        case 'ServerDeletesPin':
          this.removePinServer(data.PinId);
          break;
        case 'ServerMovesPin':
          this.movePinServer(data.PinId, data.XPosition, data.YPosition);
          break;
        case 'ServerAddsClientToTrip':
          this.serverAddsClientToTrip(data);
          break;
      }
    });
  }

  private serverAddsClientToTrip(data: any) {
    if (data.Pins && data.Pins.length > 0) {
      console.log('Received pins:');
      data.Pins.forEach((pin: any) => {
        console.log(`PinId: ${pin.PinId}, Type: ${pin.Type}, Title: ${pin.Title}, Description: ${pin.Description}, XPosition: ${pin.XPosition}, YPosition: ${pin.YPosition}, TripId: ${pin.TripId}`);
        this.addPinServer(pin); // Calling addPinServer for each pin
      });
    } else {
      console.log('No pins received from the server or pins are empty.');
    }
  }

  addPinClient() {
    const uniqueId = Date.now() * 1000 + Math.floor(Math.random() * 1000);

    this.websocketService.sendMessage({
      eventType: 'ClientWantsToAddPin',
      PinId: uniqueId,
      Type: this.selectedOption,
      Title: 'sample name',
      Description: 'sample',
      XPosition: 50,
      YPosition: 50,
      TripId: this.tripId!,
    });
  }

  removePinClient(pinId: number) {
    this.websocketService.sendMessage({
      eventType: 'ClientWantsToDeletePin',
      PinId: pinId,
      TripId: this.tripId!
    });
  }

  movePinClient(event: MouseEvent): void {
    let newX = event.clientX - this.offsetX;
    let newY = event.clientY - this.offsetY;

    const pinboardRect = this.pinboard.nativeElement.getBoundingClientRect();
    const maxX = pinboardRect.width - 200;  // Assuming pin width is 200px
    const maxY = pinboardRect.height - 100; // Assuming pin height is 100px

    this.currentPin.x = Math.max(0, Math.min(newX, maxX));
    this.currentPin.y = Math.max(0, Math.min(newY, maxY));
  }

  addPinServer(data: any) {
    this.pins.push({
      id: data.PinId,
      type: data.Type,
      title: data.Title,
      description: data.Description,
      x: data.XPosition,
      y: data.YPosition,
    });
  }

  removePinServer(pinId: number) {
    this.pins = this.pins.filter(pin => pin.id !== pinId);
  }

  movePinServer(pinId: number, xPosition: number, yPosition: number) {
    const pin = this.pins.find(pin => pin.id === pinId);
    if (pin) {
      pin.x = xPosition;
      pin.y = yPosition;
    }
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      const message = {
        eventType: "ClientWantsToBroadcastToRoom",
        tripId: this.tripId!,
        message: this.messageContent
      };
      this.websocketService.sendMessage(message);
      this.messageContent = '';
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      this.movePinClient(event);
      this.websocketService.sendMessage({
        eventType: 'ClientWantsToMovePin',
        PinId: this.currentPin.id,
        XPosition: this.currentPin.x,
        YPosition: this.currentPin.y,
        TripId: this.tripId!
      });
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
    }
  }

  onDragStart(eventData: { event: MouseEvent, pin: any }): void {
    const event = eventData.event;
    this.dragging = true;
    this.currentPin = eventData.pin;
    this.offsetX = event.clientX - eventData.pin.x;
    this.offsetY = event.clientY - eventData.pin.y;
  }

  trackById(index: number, message: any): any {
    return message.id;
  }
}
