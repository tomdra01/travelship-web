import {Component, inject, OnInit} from '@angular/core';
import {GoogleApiService} from "../../service/google-api.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  private authService = inject(GoogleApiService);

  userInfo?: { name: any; picture: any; email: any; sub: any }

  selectedLanguage: string = 'en';

  constructor(private readonly googleApi: GoogleApiService, private router: Router, private translate: TranslateService) {
  }

  clickLogOut() {
    this.authService.logout();
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    this.initializeLanguage();

    if (!this.googleApi.getToken()) {
      this.router.navigate(['notfound']);
      return;
    }

    if (this.googleApi.getToken()) {
      const profile = this.googleApi.getProfile();
      if (profile) {
        this.userInfo = {
          name: profile['name'],
          picture: profile['picture'],
          email: profile['email'],
          sub: profile['sub']
        };
      }
    }
  }

  initializeLanguage() {
    const language = sessionStorage.getItem('lang') || 'en'; // Default to English if null
    this.selectedLanguage = language; // Now always a string, never null
    this.translate.use(this.selectedLanguage);
  }


  changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedLang = selectElement.value;
    this.translate.use(selectedLang); // Change the language
    sessionStorage.setItem('lang', selectedLang); // Save selected language to sessionStorage
  }

}
