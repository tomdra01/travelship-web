import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WebsocketService } from "service/websocket.service";
import { TripDetailsService } from "service/trip-details.service";
import { UserDetailsService } from "service/user-details.service";
import {Trip} from "../../../../models/Trip";
import { fabric } from 'fabric';
import {DateSelection, Pin} from "../../../../models/Pin";

@Component({
  selector: 'app-view-travel',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
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

  dateSelection: DateSelection = {
    arrival: '',
    departure: ''
  };
  averageDate?: Date;


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
          this.addPinFromServer(data);
          break;
        case 'ServerDeletesPin':
          this.removePinFromServer(data.PinId);
          break;
        case 'ServerMovesPin':
          this.movePinFromServer(data.PinId, data.XPosition, data.YPosition);
          break;
      }
    });
  }

  addPinFromServer(data: any) {
    this.pins.push({
      id: data.PinId,
      type: data.Type,
      title: data.Title,
      description: data.Description,
      x: 50,
      y: 50
    });
  }

  removePinFromServer(pinId: number) {
    this.pins = this.pins.filter(pin => pin.id !== pinId);
  }

  movePinFromServer(pinId: number, xPosition: number, yPosition: number) {
    this.movePinUpdate(pinId, xPosition, yPosition);
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      const message = {
        eventType: "ClientWantsToBroadcastToRoom",
        roomId: this.tripId!,
        message: this.messageContent
      };
      this.websocketService.sendMessage(message);
      this.messageContent = '';
    }
  }

  trackById(index: number, message: any): any {
    return message.id;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      this.movePin(event);
      this.websocketService.sendMessage({
        eventType: 'ClientWantsToMovePin',
        pinId: this.currentPin.id,
        xPosition: this.currentPin.x,
        yPosition: this.currentPin.y,
        roomId: this.tripId!
      });
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
    }
  }

  onDragStart(event: MouseEvent, pin: any): void {
    this.dragging = true;
    this.currentPin = pin;
    this.offsetX = event.clientX - pin.x;
    this.offsetY = event.clientY - pin.y;
  }

  movePin(event: MouseEvent): void {
    let newX = event.clientX - this.offsetX;
    let newY = event.clientY - this.offsetY;

    const pinboardRect = this.pinboard.nativeElement.getBoundingClientRect();
    const maxX = pinboardRect.width - 200;  // Assuming pin width is 200px
    const maxY = pinboardRect.height - 100; // Assuming pin height is 100px

    this.currentPin.x = Math.max(0, Math.min(newX, maxX));
    this.currentPin.y = Math.max(0, Math.min(newY, maxY));
  }

  onButtonClick(pin: any): void {
    alert('Button on ' + pin.title + ' clicked!');
  }

  removePin(pinToRemove: any): void {
    this.pins = this.pins.filter(pin => pin !== pinToRemove);
  }

  addPin() {
    this.websocketService.sendMessage({
      eventType: 'ClientWantsToAddPin',
      PinId: this.pins.length + 1,
      Type: this.selectedOption,
      Title: 'sample name',
      Description: 'sample',
      RoomId: this.tripId!,
    });
  }

  private movePinUpdate(pinId: number, xPosition: number, yPosition: number) {
    const pin = this.pins.find(pin => pin.id === pinId);
    if (pin) {
      pin.x = xPosition;
      pin.y = yPosition;
    }
  }

  calculateAverageDate(): void {
    if (this.dateSelection.arrival && this.dateSelection.departure) {
      const arrivalDate = new Date(this.dateSelection.arrival);
      const departureDate = new Date(this.dateSelection.departure);
      const averageTime = (arrivalDate.getTime() + departureDate.getTime()) / 2;
      this.averageDate = new Date(averageTime);
    }
  }
}
