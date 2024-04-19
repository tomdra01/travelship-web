import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainViewComponent} from "./main-view/main-view.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {
    path: '',
    component: MainViewComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
