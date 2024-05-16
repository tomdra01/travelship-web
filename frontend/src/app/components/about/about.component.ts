import { Component } from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../service/language.service";

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
  constructor(private languageService: LanguageService) {
    this.languageService.initializeLanguage();
  }

}
