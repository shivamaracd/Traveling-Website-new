import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VanderRoutingModule } from './vander-routing.module';
import { VanderComponent } from './vander/vander.component';
import { AddVanderComponent } from './add-vander/add-vander.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VanderComponent,
    AddVanderComponent
  ],
  imports: [
    CommonModule,
    VanderRoutingModule,
    ReactiveFormsModule
  ]
})
export class VanderModule { }
