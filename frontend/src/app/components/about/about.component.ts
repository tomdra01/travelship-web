import { Component } from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor(private translate: TranslateService) {
    // Set the default language to English
    this.translate.setDefaultLang('en');

    // Optionally set the initial language based on user preference or browser settings
    this.translate.use('en');
  }

  // Function to switch languages
  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
