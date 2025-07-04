import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManifestComponent } from './manifest/manifest.component';
import { AddManifestComponent } from './add-manifest/add-manifest.component';
import { ManifestDrsComponent } from './manifest-drs/manifest-drs.component';
import { AddManifestDrsComponent } from './add-manifest-drs/add-manifest-drs.component';

const routes: Routes = [
  { path: '', component: ManifestComponent },
  { path: 'manifest', component: ManifestComponent },
  { path: 'add', component: AddManifestComponent },
  { path: 'edit/:id', component: AddManifestComponent },
  { path: 'manifest-drs', component: ManifestDrsComponent },
  { path: 'manifest-drs-add', component: AddManifestDrsComponent },
  { path: 'manifest-drs-edit/:id', component: AddManifestDrsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManifestRoutingModule { }
