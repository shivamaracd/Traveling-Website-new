import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SettingService } from '../setting.service';
import { NgToastService } from 'ng-angular-popup';
declare var window: any;
@Component({
  selector: 'app-forword-by',
  templateUrl: './forword-by.component.html',
  styleUrls: ['./forword-by.component.scss']
})
export class ForwordByComponent implements OnInit {
  data: any[] = [];
  selectedManifest: any = null;
  showViewModal: boolean = false;

  constructor(
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private service: SettingService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.loadManifests();
  }

  forwordName: string = '';

  openForwordModal() {
    const modalElement = document.getElementById('forwordModal');
    if (modalElement) {
      new window.bootstrap.Modal(modalElement).show();
    }
  }

  closeForwordModal() {
    const modalElement = document.getElementById('forwordModal');
    if (modalElement) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  saveForword() {
    console.log('Saved Forword:', this.forwordName);
    this.closeForwordModal();
    this.forwordName = '';
  }

  loadManifests() {
    this.ngxLoader.start();
    this.service.getService().subscribe({
      next: (res) => {
        console.log(res);
        $('#myTable6').DataTable().clear();
        $('#myTable6').DataTable().destroy();
        this.data = res;
        $.getScript('/assets/table/table.js');
        this.ngxLoader.stop();
      },
      error: (err) => {
        console.error('Error loading manifests:', err);
        $('#myTable6').DataTable().destroy();
        $('#myTable6').DataTable().clear();
        $.getScript('/assets/table/table.js');
        this.ngxLoader.stop();
        this.toast.error({ detail: 'Failed to load manifests', summary: 'Error' });
      }
    });
  }

  // openClientModal() {
  //   this.router.navigate(['manifest/add']);
  // }

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
    this.router.navigate(['/shipment/edit/' + id]);
  }

  viewManifest(manifest: any) {
    this.selectedManifest = manifest;
    this.showViewModal = true;
  }

  editManifest(id: number) {
    this.router.navigate(['/manifest/edit', id]);
  }

  deleteManifest(id: number) {
    if (confirm('Are you sure you want to delete this manifest?')) {
      this.service.deleteService(id).subscribe({
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



