import { Injectable } from '@angular/core';
import { GoogleApiService } from "./google-api.service";
import { TimezoneService } from "./timezone.service";

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  username?: string;
  picture?: string;
  flagUrl?: string;

  constructor(
    private googleApi: GoogleApiService,
    private timezoneService: TimezoneService
  ) {}

  getUserDetails(): void {
    if (this.googleApi.getToken()) {
      const profile = this.googleApi.getProfile();
      if (profile) {
        this.username = profile['name'];
        this.picture = profile['picture'];
      }

      const timezone = this.timezoneService.getUserTimezone();
      const country = this.timezoneService.getCountryByTimezone(timezone);
      if (country) {
        this.flagUrl = `https://flagsapi.com/${country.code}/shiny/32.png`;
      }
    } else {
      this.username = 'Guest' + Math.floor(Math.random() * 10000);
      this.picture = "/assets/user-icon.png";
    }
  }
}
