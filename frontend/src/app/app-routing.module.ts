import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainViewComponent} from "./components/main-view/main-view.component";
import {LoginComponent} from "./components/login/login.component";
import {AccountComponent} from "./components/account/account.component";
import {ViewTravelComponent} from "./components/view-travel/view-travel.component";
import {JoinPrivateTravelComponent} from "./components/join-private-travel/join-private-travel.component";
import {CreateTripComponent} from "./components/create-trip/create-trip.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {AboutComponent} from "./components/about/about.component";

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
    path: 'trips/:tripId',
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
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'notfound',
    component: NotFoundComponent,
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
