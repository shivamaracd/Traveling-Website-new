

import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../delivery.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';

interface BookingPreview {
  awb_no: string;
  client: string;
  booking_date: string;
  pin_code: string;
  state: string;
  mobile_no: string;
  volumetric_weight: number;
  status: string;
}

@Component({
  selector: 'app-delivery-import',
  templateUrl: './delivery-import.component.html',
  styleUrls: ['./delivery-import.component.scss']
})
export class DeliveryImportComponent implements OnInit {
  data: any[] = []
  selectedFile: File | null = null;
  previewData: BookingPreview[] = [];
  
  constructor(
    private deliveryService: DeliveryService,
    private toast: NgToastService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.ngxLoader.start();
    this.deliveryService.getDeliveryData().subscribe(res => {
      console.log(res)
      $('#myTable8').DataTable().clear();
      $('#myTable8').DataTable().destroy();
      this.data = res.data;
      console.log(this.data)
      $.getScript('/assets/table/table.js');
      this.ngxLoader.stop();
    }, err => {
      console.log(err)
      $('#myTable8').DataTable().destroy();
      $('#myTable8').DataTable().clear();
      $.getScript('/assets/table/table.js');
      this.ngxLoader.stop();
    })
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      // Check file type
      const allowedTypes = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        this.toast.error({
          detail: 'Error',
          summary: 'Please select a valid Excel or CSV file',
          duration: 3000
        });
        return;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.toast.error({
          detail: 'Error',
          summary: 'File size should not exceed 5MB',
          duration: 3000
        });
        return;
      }

      this.selectedFile = file;
      console.log(this.selectedFile);
      this.previewFileContents();
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.previewData = [];
  }

  previewFileContents(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('filename', this.selectedFile);

    // Call your service method to preview file contents
    this.deliveryService.previewDeliveryFile(formData).subscribe({
      next: (response: { data: BookingPreview[] }) => {
        this.previewData = response.data || [];
        if (this.previewData.length > 0) {
          this.toast.success({
            detail: 'Success',
            summary: 'File preview loaded successfully',
            duration: 3000
          });
        }
      },
      error: (error: Error) => {
        this.toast.error({
          detail: 'Error',
          summary: error.message || 'Failed to preview file',
          duration: 3000
        });
      }
    });
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('filename', this.selectedFile);

    this.deliveryService.importDeliveryFile(formData).subscribe({
      next: (response: any) => {
        this.toast.success({
          detail: 'Success',
          summary: 'Bookings imported successfully',
          duration: 3000
        });
        this.clearFile();
        this.getData();
      },
      error: (error: Error) => {
        this.toast.error({
          detail: 'Error',
          summary: error.message || 'Failed to import bookings',
          duration: 3000
        });
      }
    });
  }
}

