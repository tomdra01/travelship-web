import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WebsocketService } from "../../service/websocket.service";
import { TripDetailsService } from "../../service/trip-details.service";
import { UserDetailsService } from "../../service/user-details.service";
import {Trip} from "../../../../models/Trip";
import { fabric } from 'fabric';

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
  private canvas!: fabric.Canvas;

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

    this.initializeFabric();
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
          this.moveFabricPin(data.PinId, data.XPosition, data.YPosition);
          break;
      }
    });
  }

  initializeFabric() {
    this.canvas = new fabric.Canvas('pinboard', {
      hoverCursor: 'pointer',
      selection: true,
      backgroundColor: '#f3f3f3'
    });

    this.canvas.on('object:moving', (e) => {
      let obj = e.target as CustomFabricObject; // Use type assertion here
      if (obj && obj.id !== undefined) { // Check that `id` is not undefined
        this.websocketService.sendMessage({
          eventType: 'ClientWantsToMovePin',
          pinId: obj.id,
          xPosition: obj.left,
          yPosition: obj.top,
          roomId: this.tripId!
        });
      }
    });


    // Load pins initially
    this.pins.forEach(pin => this.addFabricPin(pin));
  }

  addFabricPin(pin: any) {
    const rect = new fabric.Rect({
      left: pin.x,
      top: pin.y,
      fill: 'red',
      width: 60,
      height: 70,
      hasControls: true
    }) as CustomFabricObject;

    rect.id = pin.id; // Now TypeScript knows about `id`
    this.canvas.add(rect);
  }

  addNewObject() {
    const rect = new fabric.Rect({
      left: 100, // Default position
      top: 100, // Default position
      fill: 'red',
      width: 60,
      height: 70,
      hasControls: true
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect); // Optionally set it as the active object
  }

  removeSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
    }
  }

  moveFabricPin(pinId: number, xPosition: number, yPosition: number) {
    const obj = this.canvas.getObjects().find(obj => (obj as CustomFabricObject).id === pinId) as CustomFabricObject | undefined;
    if (obj) {
      obj.set({ left: xPosition, top: yPosition });
      this.canvas.requestRenderAll();
    }
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

  trackById(index: number, message: any): any {
    return message.id;
  }
}

interface CustomFabricObject extends fabric.Object {
  id?: number; // Optional custom property
}
