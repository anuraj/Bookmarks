import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscribeMailRoutingModule } from './subscribe-mail-routing.module';
import { SubscribeMailComponent } from './subscribe-mail.component';


@NgModule({
  declarations: [
    SubscribeMailComponent
  ],
  imports: [
    CommonModule,
    SubscribeMailRoutingModule
  ]
})
export class SubscribeMailModule { }
