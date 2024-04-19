import { Component } from '@angular/core';
import {GoogleApiService, UserInfo} from "../../../service/google-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  loginButton = true;

  userInfo?: UserInfo

  constructor(private readonly googleApi: GoogleApiService, private router: Router) {
    googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info
    })
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

  loginClick() {
    //this.googleApi.initLogin();
    this.router.navigate(['login']);
  }
}
