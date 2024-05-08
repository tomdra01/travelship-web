import { Component, OnInit } from '@angular/core';
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
        case 'ServerScalesPin':
          this.scaleFabricPin(data.PinId, data.ScaleX, data.ScaleY);
          break;
        case 'ServerAddsPin':
          this.addPinFromServer(data);
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

    // Event: Object Moving
    this.canvas.on('object:moving', (e) => {
      console.log('Object moving event');
      let obj = e.target as CustomFabricObject;
      if (obj && obj.id !== undefined) {
        this.websocketService.sendMessage({
          eventType: 'ClientWantsToMovePin',
          pinId: obj.id,
          xPosition: obj.left,
          yPosition: obj.top,
          roomId: this.tripId!
        });
      }
    });

    // Event: Object Resizing
    this.canvas.on('object:scaling', (e) => {
      console.log('Object scaling event');
      let obj = e.target as CustomFabricObject;
      if (obj && obj.id !== undefined) {
        this.websocketService.sendMessage({
          eventType: 'ClientWantsToScalePin',
          pinId: obj.id,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          roomId: this.tripId!
        });
      }
    });

    // Event: Object Rotating
    this.canvas.on('object:rotating', (e) => {
      let obj = e.target as CustomFabricObject;
      if (obj && obj.id !== undefined) {
        // Handle rotating event
      }
    });

    // Event: Object Removed
    this.canvas.on('object:removed', (e) => {
      let obj = e.target as CustomFabricObject;
      if (obj && obj.id !== undefined) {
        // Handle object removed event
      }
    });
  }

  addNewObject(): void {
    // Dimensions for the rectangle
    const rectWidth = 100;
    const rectHeight = 100;

    const uniqueId = Date.now();

    // Calculating the center of the canvas
    const centerX = (this.canvas.getWidth() / 2) - (rectWidth / 2);
    const centerY = (this.canvas.getHeight() / 2) - (rectHeight / 2);

    const rect = new fabric.Rect({
      left: centerX,
      top: centerY,
      fill: 'black',
      width: rectWidth,
      height: rectHeight,
      hasControls: true
    }) as CustomFabricObject;

    rect.id = uniqueId;
    rect.title = "Black rectangle";
    rect.description = "Just a rectangle";

    this.websocketService.sendMessage({
      eventType: 'ClientWantsToAddPin',
      pinId: rect.id,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      title: rect.title,
      description: rect.description,
      roomId: this.tripId!
    });
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

  scaleFabricPin(pinId: number, scaleX: number, scaleY: number) {
    const obj = this.canvas.getObjects().find(obj => (obj as CustomFabricObject).id === pinId) as CustomFabricObject | undefined;
    if (obj) {
      // Check if width and height are defined
      if (typeof obj.width !== 'undefined' && typeof obj.height !== 'undefined') {
        // Calculate new dimensions
        const newWidth = obj.width * scaleX;
        const newHeight = obj.height * scaleY;

        // Update object dimensions
        obj.set({
          scaleX: scaleX,
          scaleY: scaleY,
          width: newWidth,
          height: newHeight
        });

        // Optionally, you may want to update other properties like position
        // if scaling from a different origin than top-left corner

        // Request canvas render
        this.canvas.requestRenderAll();
      } else {
        console.error(`Object with ID ${pinId} does not have defined width or height.`);
      }
    } else {
      console.error(`Object with ID ${pinId} not found.`);
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

  addPinFromServer(data: any) {
    const pin = new fabric.Rect({
      left: data.Left,
      top: data.Top,
      fill: data.color || 'blue',  // Default color if none provided
      width: data.Width,
      height: data.Height,
      hasControls: true
    }) as CustomFabricObject; // Asserting that this is a CustomFabricObject

    // Now TypeScript knows `pin` includes CustomFabricObject properties
    pin.id = data.PinId;
    pin.title = data.Title;
    pin.description = data.Description;

    this.canvas.add(pin);
    this.canvas.renderAll(); // Refresh the canvas to show the new pin
  }

  trackById(index: number, message: any): any {
    return message.id;
  }
}

interface CustomFabricObject extends fabric.Object {
  id?: number; // Optional custom property
  title?: string; // Optional custom property
  description?: string; // Optional custom property
}
