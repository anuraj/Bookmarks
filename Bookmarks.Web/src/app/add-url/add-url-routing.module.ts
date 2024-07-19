import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUrlComponent } from './add-url.component';

const routes: Routes = [{ path: '', component: AddUrlComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddUrlRoutingModule { }
