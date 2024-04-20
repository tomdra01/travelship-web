import { HttpClient, HttpHeaders } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import {Router} from "@angular/router";

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);

  constructor() {
    this.initConfiguration();
  }
  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      redirectUri: window.location.origin+'/login',
      clientId: '916269164787-rqfbtvs8asktdfdsm7anje90tst69ata.apps.googleusercontent.com',
      scope: 'openid profile email',
      showDebugInformation: true,
    };


    this.oAuthService.configure(authConfig);
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    this.oAuthService.setupAutomaticSilentRefresh();
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  getProfile() {
    return this.oAuthService.getIdentityClaims();
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }
}

export interface UserInfo {
  name: string;
  picture: string;
  email: string;
}
