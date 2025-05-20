import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManifestRoutingModule } from './manifest-routing.module';
import { ManifestComponent } from './manifest/manifest.component';
import { AddManifestComponent } from './add-manifest/add-manifest.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShipmentService } from '../shipment/shipment.service';


@NgModule({
  declarations: [
    ManifestComponent,
    AddManifestComponent
  ],
  imports: [
    CommonModule,
    ManifestRoutingModule,
    ReactiveFormsModule,
    
  ],
  providers:[ShipmentService]
})
export class ManifestModule { }
