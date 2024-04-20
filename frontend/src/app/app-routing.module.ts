import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainViewComponent} from "./main-view/main-view.component";
import {LoginComponent} from "./login/login.component";
import {AccountComponent} from "./account/account.component";
import {ViewTravelComponent} from "./view-travel/view-travel.component";

const routes: Routes = [
  {
    path: '',
    component: MainViewComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'travel/:tripId',
    component: ViewTravelComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
