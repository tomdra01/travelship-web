import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule, DatePipe} from "@angular/common";
import {GoogleApiService} from "../../../service/google-api.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ServerAddsClientToRoomDto, ServerBroadcastsMessageWithUsernameDto} from "../../../ws-dto/BaseDto";
import {TripService} from "../../../service/TripService";

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
export class ViewTravelComponent implements OnInit{
  //private authService = inject(GoogleApiService);
  tripId: number | undefined;
  tripInfo: any;
  userInfo?: { name: any; picture: any; email: any }
  username?: string;
  picture?: any;

  ws: WebSocket = new WebSocket('ws://localhost:8181');
  messageContent: string | undefined;
  messages: { text: string, fromUser: boolean }[] = [];


  constructor(private tripService: TripService, private route: ActivatedRoute, private readonly googleApi: GoogleApiService, private router: Router) {
    // Get the tripId from the URL
    this.route.params.subscribe(params => {
      this.tripId = +params['tripId'];
    });

    this.ws = new WebSocket('ws://localhost:8181');
    this.ws.onopen = () => {
      console.log("WebSocket connection established.");
      this.initiateWebSocketCommunication();
    };
    this.ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    this.ws.onmessage = (event) => {
      const dto = JSON.parse(event.data);
      // @ts-ignore
      if (dto.eventType && this[dto.eventType]) {
        // @ts-ignore
        this[dto.eventType](dto);
      } else {
        console.warn("Unhandled event type:", dto.eventType);
      }
    };
  }

  sendMessage() {
    this.clientBroadcastToRoom();
    console.log(this.messages);
  }

  initiateWebSocketCommunication() {
    if (this.userInfo) {
      this.clientSetUsername();
      this.enterRoom();
    }
  }

  ngOnInit(): void {
    if (this.googleApi.getToken()) {
      const profile = this.googleApi.getProfile();
      if (profile) {
        this.userInfo = {
          name: profile['name'],
          picture: profile['picture'],
          email: profile['email']
        };
        this.username = this.userInfo.name;
        this.picture = this.userInfo.picture;
      }
    }

    this.route.params.subscribe(params => {
      this.tripId = +params['tripId'];
      if (this.tripId) {
        this.loadTripDetails(this.tripId);
      }
    });

    this.initiateWebSocketCommunication();
  }

  loadTripDetails(tripId: number): void {
    this.tripService.getTripById(tripId).subscribe({
      next: (trip) => {
        this.tripInfo = trip;
      },
      error: (error) => {
        console.error('Failed to load trip:', error);
      }
    });
  }


  // WEBSOCKET IMPLEMENTATION

  clientSetUsername() {
    var object = {
      eventType: "ClientWantsToSetUsername",
      Username: this.username
    };
    this.ws.send(JSON.stringify(object));
    console.log("Username set to: " + this.username);
  }

  enterRoom() {
    var object = {
      eventType: "ClientWantsToEnterRoom",
      roomId: Number(this.tripId)
    };
    this.ws.send(JSON.stringify(object));
  }

  clientBroadcastToRoom() {
    const object = {
      eventType: "ClientWantsToBroadcastToRoom",
      roomId: Number(this.tripId),
      message: this.messageContent
    };
    this.ws.send(JSON.stringify(object));

    //this.messages.unshift({ text: "" + this.messageContent, fromUser: true });
  }
  RoomMessageReceived(dto: any) {
    // Assuming dto contains a 'message' and 'username' field
    const isFromUser = dto.username === this.username;
    this.messages.unshift({ text: dto.username + ": " + dto.message, fromUser: isFromUser });
  }

  ServerBroadcastsMessageWithUsername(dto: ServerBroadcastsMessageWithUsernameDto) {
    const isFromUser = dto.username === this.username;
    this.messages.unshift({ text: dto.username + ": " + dto.message, fromUser: isFromUser });
  }

  ServerAddsClientToRoom(dto: ServerAddsClientToRoomDto) {
    console.log("A new user joined the room " + this.tripId);
  }
}
