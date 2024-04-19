import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {GoogleApiService, UserInfo} from "../../../service/google-api.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
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

  clickGoogleLogin() {
    this.router.navigate(['']);
    this.googleApi.initLogin();

  }
}
