import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule, DatePipe} from "@angular/common";
import {GoogleApiService} from "../../../service/google-api.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ServerAddsClientToRoomDto, ServerBroadcastsMessageWithUsernameDto} from "../../../ws-dto/BaseDto";
import {TripService} from "../../../service/TripService";
import {TimezoneService} from "../../../service/timezone.service";

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
  tripId: number | undefined;
  tripInfo: any;
  userInfo?: { name: string; picture: string; email: string };
  username?: string;
  picture?: string;
  flagUrl: string | undefined;
  ws: WebSocket;
  messageContent: string = '';
  messages: { text: string, username: string, fromUser: boolean, flagUrl?: string }[] = [];

  constructor(
    private tripService: TripService,
    private route: ActivatedRoute,
    private timezoneService: TimezoneService,
    private googleApi: GoogleApiService,
    private router: Router
  ) {
    this.ws = new WebSocket('ws://localhost:8181');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tripId = +params['tripId'];
      if (this.tripId) {
        this.loadTripDetails(this.tripId);
      }
    });

    // If user is Logged IN
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

      const timezone = this.timezoneService.getUserTimezone();
      const country = this.timezoneService.getCountryByTimezone(timezone);
      if (country) {
        this.flagUrl = `https://flagsapi.com/${country.code}/shiny/32.png`;
      }
    }

    // If user is NOT Logged IN
    if (!this.googleApi.getToken()) {
      this.username = 'GUEST' + Math.floor(Math.random() * 1000);
      this.picture = "/assets/user-icon.png"

      const timezone = this.timezoneService.getUserTimezone();
      const country = this.timezoneService.getCountryByTimezone(timezone);
      if (country) {
        this.flagUrl = `https://flagsapi.com/${country.code}/shiny/32.png`;
      }
    }

    this.initWebSocket();
  }

  private initWebSocket() {
    this.ws.onopen = () => {
      console.log("WebSocket connection established.");
      this.clientSetUsername();
      this.enterRoom();
    };

    this.ws.onmessage = (event) => {
      const dto = JSON.parse(event.data);
      if (dto.eventType === 'ServerBroadcastsMessageWithUsername') {
        this.messages.push({
          text: dto.message,
          username: dto.username,
          fromUser: dto.username === this.username,
          flagUrl: dto.username === this.username ? this.flagUrl : undefined
        });
      }
    };

    this.ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };
  }

  sendMessage() {
    if (this.messageContent.trim()) {
      const message = {
        eventType: "ClientWantsToBroadcastToRoom",
        roomId: Number(this.tripId),
        message: this.messageContent
      };
      this.ws.send(JSON.stringify(message));
      this.messageContent = '';
    }
  }

  loadTripDetails(tripId: number) {
    this.tripService.getTripById(tripId).subscribe({
      next: (trip) => {
        this.tripInfo = trip;
      },
      error: (error) => {
        console.error('Failed to load trip:', error);
      }
    });
  }

  private clientSetUsername() {
    const object = {
      eventType: "ClientWantsToSetUsername",
      Username: this.username
    };
    this.ws.send(JSON.stringify(object));
    console.log("Username set to: " + this.username);
  }

  private enterRoom() {
    const object = {
      eventType: "ClientWantsToEnterRoom",
      roomId: Number(this.tripId)
    };
    this.ws.send(JSON.stringify(object));
  }

  trackById(index: number, message: any): any {
    return message.id;  // Make sure each message has a unique 'id' property
  }
}
