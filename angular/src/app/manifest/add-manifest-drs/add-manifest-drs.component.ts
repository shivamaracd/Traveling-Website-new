import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';
import { ManifestService } from '../manifest.service';
import { ShipmentService } from 'src/app/shipment/shipment.service';
import { VanderService } from 'src/app/vander/vander.service';

@Component({
  selector: 'app-add-manifest-drs',
  templateUrl: './add-manifest-drs.component.html',
  styleUrls: ['./add-manifest-drs.component.scss']
})
export class AddManifestDrsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public manifestDrsForm!: FormGroup;
  public trackingOptions: any;
  public emailError: string = '';
  public profilePic: string | null = null;
  public data: any;
  public nidds: any;
  public packages: any[] = [];
  public availableShipments: any[] = [];
  public vendorList: any = []
  public isDRS: boolean = false;

  constructor(private toest: NgToastService, private ngxLoader: NgxUiLoaderService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private service: ManifestService, private shipment: ShipmentService, private vanderservice: VanderService
  ) {
    this.manifestDrsForm = this.fb.group({
      tracking_number: [''],
      origin: [''],
      manifest_number: [{value: '', disabled: false}],
      drs_sheet_date: [''],
      delivery_boys_name: [''],
      delivery_boys_contact: [''],
      drs_sheet_no: [''],
      shipment_status: ['']
    });
  }

  // Form control getters
  // get origin() { return this.manifestDrsForm.get('origin'); }
  // get manifest_number() { return this.manifestDrsForm.get('manifest_number'); }
  // get drs_sheet_date() { return this.manifestDrsForm.get('drs_sheet_date'); }
  // get delivery_boys_name() { return this.manifestDrsForm.get('delivery_boys_name'); }
  // get delivery_boys_contact() { return this.manifestDrsForm.get('delivery_boys_contact'); }
  // get drs_sheet_no() { return this.manifestDrsForm.get('drs_sheet_no'); }
  // get shipment_status() { return this.manifestDrsForm.get('shipment_status'); }

  // Generate Manifest Number
  generateManifestNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9000 + 1000); // 4 digit random number
    const manifestNumber = `MF${year}${month}${day}${random}`;
    return manifestNumber;
  }

  // Convert comma separated string to array and validate tracking numbers
  getTrackingNumbersArray(trackingString: string): string[] {
    if (!trackingString) return [];
    
    // Split by comma and clean up each tracking number
    const trackingArray = trackingString
      .split(',')
      .map(track => track.trim())
      .filter(track => track.length > 0); // Remove empty strings
    
    return [...new Set(trackingArray)]; // Remove duplicates using Set
  }

  // Validate if tracking numbers exist in trackingOptions
  validateTrackingNumbers(trackingNumbers: string[]): boolean {
    const invalidNumbers = trackingNumbers.filter(track => 
      !this.trackingOptions.some((option: any) => option.awb_no === track)
    );

    if (invalidNumbers.length > 0) {
      this.toest.error({
        detail: "Invalid Tracking Numbers",
        summary: `Following tracking numbers are invalid: ${invalidNumbers.join(', ')}`,
        duration: 5000
      });
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    // Set initial manifest number
    this.manifestDrsForm.patchValue({
      manifest_number: this.generateManifestNumber()
    });

    this.data = this.route.snapshot.paramMap.get('id');
    console.log("data", this.data)
    if (this.data) {
      this.service.getEditValuedrs(this.data).subscribe((res) => {
        console.log('edit value', res);
        if (res.data && res.data.length > 0) {
          const manifest = res.data[0];
          this.nidds = manifest.id;
          
          const date = new Date(manifest.created_at);
          let value = date.toISOString().split('T')[0];
          this.manifestDrsForm.patchValue({
            manifest_number: manifest.manifest_number || '',
            origin: manifest.origin || '',
            drs_sheet_date: value || '',
            tracking_number: manifest.tracking_numbers ? manifest.tracking_numbers.join(', ') : '',
            drs_sheet_no: manifest.drs_sheet_no || '',
            delivery_boys_name: manifest.delivery_boys_name || '',
            delivery_boys_contact: manifest.delivery_boys_contact || '',
            shipment_status: manifest.shipment_status || ''
          });
        }
      });
    }

    this.getData();
    this.getSepment();
  }

  getSepment() {
    this.ngxLoader.start(); // Show loader
    this.shipment.getService().subscribe({
      next: (res) => {
        console.log(res);
        this.trackingOptions = res;
        this.ngxLoader.stop(); // Hide loader
      },
      error: (err) => {
        console.error('Error fetching shipments:', err);
        this.toest.error({detail:"Error",summary:"Failed to load tracking options", duration: 5000});
        this.ngxLoader.stop(); // Hide loader
      }
    });
  }

  getData() {
    this.ngxLoader.start(); // Show loader
    this.service.getService().subscribe({
      next: (res) => {
        console.log(res);
        this.data = res;
        this.ngxLoader.stop(); // Hide loader
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.toest.error({detail:"Error",summary:"Failed to load data", duration: 5000});
        this.ngxLoader.stop(); // Hide loader
      }
    });
  }

  onProfilePicChange(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    console.log("form data", this.manifestDrsForm.value);
    
    if (this.manifestDrsForm.invalid) {
      this.manifestDrsForm.markAllAsTouched();
      this.toest.error({detail:"Validation Error",summary:"Please fill all required fields", duration: 5000});
      return;
    }

    const formData = this.manifestDrsForm.getRawValue();
    
    // Convert tracking numbers string to array
    const trackingNumbers = this.getTrackingNumbersArray(formData.tracking_number);
    
    // Validate if we have any tracking numbers
    if (trackingNumbers.length === 0) {
      this.toest.error({
        detail: "Error",
        summary: "Please enter at least one tracking number",
        duration: 5000
      });
      return;
    }

    // Replace tracking_number string with array
    formData.tracking_numbers = trackingNumbers;
    delete formData.tracking_number;

    console.log('Submitted data:', formData);
    if (formData) {
      if (this.nidds > 0) {
        this.service.updateDRSData(formData, this.nidds).subscribe(res => {
          console.log("update", res)
          this.nidds = null
          this.router.navigate(['manifest/manifest-drs'])
        }, err => {
          console.log(err)
        })
      } else {
        this.service.saveDRSData(formData).subscribe(res => {
          console.log("save", res)
          this.router.navigate(['manifest/manifest-drs'])
        }, err => {
          console.log(err)
        })
      }
    }
  }

  onCancel(): void {
    this.manifestDrsForm.reset();
    this.profilePic = null;
    this.router.navigate(['/manifest/manifest-drs']);
  }

  onBack(): void {
    this.router.navigate(['/manifest/manifest-drs']);
  }
}


