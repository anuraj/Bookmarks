import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscribeMailComponent } from './subscribe-mail.component';

const routes: Routes = [{ path: '', component: SubscribeMailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscribeMailRoutingModule { }
