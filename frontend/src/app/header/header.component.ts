import {Component, OnInit} from '@angular/core';
import {GoogleApiService, UserInfo} from "../../../service/google-api.service";
import {Router} from "@angular/router";
import {waitForAsync} from "@angular/core/testing";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
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
    this.googleApi.initLogin();

    //this.router.navigate(['login']);
  }

  accountClick() {
    this.router.navigate(['login']);
  }

  homeButton(){
    this.router.navigate(['']);
  }

  joinTravelButton() {
    this.router.navigate(['join']);
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('id_token_claims_obj');
    if (token) {
      const tokenObj = JSON.parse(token);

      this.userInfo = {
        info: {
          sub: tokenObj.sub,
          email: tokenObj.email,
          name: tokenObj.name,
          picture: tokenObj.picture
        }
      };

      this.loginButton = false;
    }
  }
}
