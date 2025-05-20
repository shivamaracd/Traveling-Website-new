import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryStateCityService } from './services/country-state-city.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    CountryStateCityService
  ]
})
export class SharedModule { } 