import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { NgbdPlotModalContent } from '../modal/plot/plot.modal';

@NgModule({
  declarations: [
    HomeComponent,
    NgbdPlotModalContent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgbModule,
    FormsModule
  ],
  exports: [FormsModule],
})
export class HomeModule { }
