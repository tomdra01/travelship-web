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
    this.initializeLanguage();
  }

  private initializeLanguage() {
    const language = sessionStorage.getItem('lang') || 'en';
    this.translate.use(language);
  }
}
