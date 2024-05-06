import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {GoogleApiService, UserInfo} from "../../service/google-api.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userInfo?: UserInfo
  private authService = inject(GoogleApiService);


  constructor(private readonly googleApi: GoogleApiService, private router: Router) {

  }

  clickGoogleLogin() {
    this.authService.login();
  }
}
