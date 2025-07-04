import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManifestRoutingModule } from './manifest-routing.module';
import { ManifestComponent } from './manifest/manifest.component';
import { AddManifestComponent } from './add-manifest/add-manifest.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShipmentService } from '../shipment/shipment.service';
import { ManifestDrsComponent } from './manifest-drs/manifest-drs.component';
import { AddManifestDrsComponent } from './add-manifest-drs/add-manifest-drs.component';


@NgModule({
  declarations: [
    ManifestComponent,
    AddManifestComponent,
    ManifestDrsComponent,
    AddManifestDrsComponent
  ],
  imports: [
    CommonModule,
    ManifestRoutingModule,
    ReactiveFormsModule,
    
  ],
  providers:[ShipmentService]
})
export class ManifestModule { }
