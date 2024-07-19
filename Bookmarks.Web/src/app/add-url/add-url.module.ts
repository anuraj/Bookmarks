import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddUrlRoutingModule } from './add-url-routing.module';
import { AddUrlComponent } from './add-url.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddUrlComponent
  ],
  imports: [
    CommonModule,
    AddUrlRoutingModule,
    ReactiveFormsModule
  ]
})
export class AddUrlModule { }
