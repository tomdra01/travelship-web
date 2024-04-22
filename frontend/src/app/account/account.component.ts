import {Component, inject, OnInit} from '@angular/core';
import {GoogleApiService} from "../../../service/google-api.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  private authService = inject(GoogleApiService);

  userInfo?: { name: any; picture: any; email: any }

  constructor(private readonly googleApi: GoogleApiService, private router: Router) {
  }

  clickLogOut() {
    this.authService.logout();
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
      }
    }
  }

}
