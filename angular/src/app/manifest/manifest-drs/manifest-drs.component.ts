
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ManifestService } from '../manifest.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-manifest-drs',
  templateUrl: './manifest-drs.component.html',
  styleUrls: ['./manifest-drs.component.scss']
})
export class ManifestDrsComponent implements OnInit {
  public data: any[] = [];
  public selectedManifest: any = null;
  public showViewModal: boolean = false;
  public isDRS: boolean = false;

  constructor(
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private service: ManifestService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.loadManifests();

  }

  loadManifests() {
    // this.ngxLoader.start();
    this.service.getDrsManifest().subscribe({
      next: (res) => {
        console.log(res);
        $('#drsmanifest').DataTable().clear();
        $('#drsmanifest').DataTable().destroy();
        this.data = res.data;
        $.getScript('/assets/table/table.js');
        // this.ngxLoader.stop();
      },
      error: (err) => {
        console.error('Error loading manifests:', err);
        $('#drsmanifest').DataTable().destroy();
        $('#drsmanifest').DataTable().clear();
        $.getScript('/assets/table/table.js');
        // this.ngxLoader.stop();
        this.toast.error({ detail: 'Failed to load manifests', summary: 'Error' });
      }
    });
  }

  openClientModal() {
    this.router.navigate(['manifest/manifest-drs-add']);
  }

  onDelete(id: any) {
    if (!confirm('Are you sure, you want to delete this Client!')) {
      return;
    }
    if (id) {
      this.service.deleteService(id).subscribe(res => {
        if (res.error == 0) {
          this.loadManifests();
        } else {
          this.loadManifests();
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onEdit(id: any) {
    this.router.navigate(['manifest/manifest-drs-edit/' + id]);
  }

  viewManifest(manifest: any) {
    this.selectedManifest = manifest;
    this.showViewModal = true;
  }

  editManifest(id: number) {
    this.router.navigate(['/manifest/manifest-drs-edit/' + id]);
  }

  deleteManifest(id: number) {
    if (confirm('Are you sure you want to delete this manifest?')) {
      this.service.deleteDRSData(id).subscribe({
        next: (res) => {
          this.toast.success({ detail: 'Manifest deleted successfully', summary: 'Success' });
          this.loadManifests();
        },
        error: (err) => {
          console.error('Error deleting manifest:', err);
          this.toast.error({ detail: 'Failed to delete manifest', summary: 'Error' });
        }
      });
    }
  }
}



