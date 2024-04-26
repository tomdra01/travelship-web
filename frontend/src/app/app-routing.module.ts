import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainViewComponent} from "./main-view/main-view.component";
import {LoginComponent} from "./login/login.component";
import {AccountComponent} from "./account/account.component";
import {ViewTravelComponent} from "./view-travel/view-travel.component";
import {JoinPrivateTravelComponent} from "./join-private-travel/join-private-travel.component";
import {CreateTripComponent} from "./create-trip/create-trip.component";
import {NotFoundComponent} from "./not-found/not-found.component";

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
  },
  {
    path: 'join',
    component: JoinPrivateTravelComponent,
  },
  {
    path: 'create',
    component: CreateTripComponent,
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
