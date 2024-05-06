import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WebsocketService } from "../../service/websocket.service";
import { TripDetailsService } from "../../service/trip-details.service";
import { UserDetailsService } from "../../service/user-details.service";
import {Trip} from "../../../../models/Trip";

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
  pins = [
    { id: 1, title: 'Pin 1', description: 'Description for Pin 1', x: 50, y: 100 },
    { id: 2, title: 'Pin 2', description: 'Description for Pin 2', x: 150, y: 200 }
  ];
  currentPin: any = null;
  offsetX: number = 0;
  offsetY: number = 0;
  dragging: boolean = false;
  pinName: string = '';

  @ViewChild('pinboard', { static: true }) pinboard!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websocketService: WebsocketService,
    private tripDetailsService: TripDetailsService,
    private userDetails: UserDetailsService
  ) {}

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

  private initWebSocket() {
    this.websocketService.initWebSocket(this.username!, this.tripId!, (data) => {
      switch(data.eventType) {
        case 'ServerBroadcastsMessageWithUsername':
          this.messages.push({
            text: data.message,
            username: data.username,
            fromUser: data.username === this.username,
            flagUrl: data.username === this.username ? this.flagUrl : undefined
          });
          break;
        case 'ServerMovesPin':
          this.movePinUpdate(data.PinId, data.XPosition, data.YPosition);
          break;
      }
    });
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

  loadTripDetails(tripId: number) {
    this.tripDetailsService.loadTripDetails(tripId).subscribe({
      next: (trip: Trip | null) => {
        this.tripInfo = trip;
        if (!this.tripInfo) {
          console.error('Failed to load trip details');
          this.router.navigate(['notfound']);
        }
      },
      error: (error: any) => {
        console.error('Failed to load trip details:', error);
        this.router.navigate(['notfound']);
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      this.movePin(event);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
      this.websocketService.sendMessage({
        eventType: 'ClientWantsToMovePin',
        pinId: this.currentPin.id,
        xPosition: this.currentPin.x,
        yPosition: this.currentPin.y,
        roomId: this.tripId!
      });
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
    this.pins.push({id: this.pins.length + 1, title: this.pinName, description: 'sample', x: 0, y: 0});
    this.pinName = '';
  }

  private movePinUpdate(pinId: number, xPosition: number, yPosition: number) {
    const pin = this.pins.find(pin => pin.id === pinId);
    if (pin) {
      pin.x = xPosition;
      pin.y = yPosition;
    }
  }

  trackById(index: number, message: any): any {
    return message.id;
  }
}
