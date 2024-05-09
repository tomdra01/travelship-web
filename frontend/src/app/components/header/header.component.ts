import {Component, inject, OnInit} from '@angular/core';
import {GoogleApiService} from "../../service/google-api.service";
import {Router} from "@angular/router";
import {TimezoneService} from "../../service/timezone.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  loginButton = true;
  private authService = inject(GoogleApiService);
  flagUrl: string | undefined;

  userInfo?: { name: any; picture: any; email: any }


  constructor(
    private readonly googleApi: GoogleApiService,
    private timezoneService: TimezoneService,
    private router: Router
  ) {
  }

  accountClick() {
    this.router.navigate(['account']);
  }

  homeButton(){
    this.router.navigate(['']);
  }

  joinTravelButton() {
    this.router.navigate(['join']);
  }

  loginClick() {
    this.router.navigate(['login']);
  }
  ngOnInit(): void {
    if (this.googleApi.getToken()) {
      this.loginButton = false;
      const profile = this.googleApi.getProfile();
      if (profile) {
        this.userInfo = {
          name: profile['name'],
          picture: profile['picture'],
          email: profile['email']
        };

        const timezone = this.timezoneService.getUserTimezone();
        const country = this.timezoneService.getCountryByTimezone(timezone);
        if (country) {
          this.flagUrl = `https://flagsapi.com/${country.code}/shiny/32.png`;
        }
      }
    }
  }
}

