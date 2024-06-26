import {inject, Injectable} from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private oAuthService = inject(OAuthService);
  private router = inject(Router);

  constructor() {
    this.initConfiguration();
    this.handleAuthenticationEvents();
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

  handleAuthenticationEvents() {
    this.oAuthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      }
    });
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
  sub: string;
}
