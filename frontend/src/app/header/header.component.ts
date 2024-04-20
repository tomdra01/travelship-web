import {Component, inject, OnInit} from '@angular/core';
import {GoogleApiService, UserInfo} from "../../../service/google-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  loginButton = true;
  private authService = inject(GoogleApiService);

  userInfo?: { name: any; picture: any; email: any }


  constructor(private readonly googleApi: GoogleApiService, private router: Router) {
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
    //this.authService.login();
    this.router.navigate(['login']);
  }
  ngOnInit(): void {
    if (this.googleApi.getToken()) {
      this.loginButton = false;
      const profile = this.googleApi.getProfile();
      if (profile) {
        console.log('User Info:', profile);
        // Accessing properties using bracket notation
        this.userInfo = {
          name: profile['name'],   // Using bracket notation for properties
          picture: profile['picture'],
          email: profile['email']
        };
      }
    }
  }

}

