import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  public initializeLanguage() {
    const language = sessionStorage.getItem('lang') || 'en';
    this.translate.use(language);
  }
}
