import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';
import { ManifestService } from '../manifest.service';
import { ShipmentService } from 'src/app/shipment/shipment.service';
import { VanderService } from 'src/app/vander/vander.service';

@Component({
  selector: 'app-add-manifest',
  templateUrl: './add-manifest.component.html',
  styleUrls: ['./add-manifest.component.scss']
})
export class AddManifestComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public manifestForm!: FormGroup;
  public trackingOptions: any
  public emailError: string = '';
  public profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';
  public data: any;
  public nidds: any;
  public packages: any[] = [];
  public availableShipments: any[] = [];
  public vendorList: any = []
  public isDRS: boolean = false;
  constructor(private toest: NgToastService, private ngxLoader: NgxUiLoaderService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private service: ManifestService, private shipment: ShipmentService, private vanderservice: VanderService
  ) {
    this.manifestForm = this.fb.group({
      tracking_number: [''],
      origin: ['', Validators.required],
      manifest_number: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      date: ['', Validators.required],
      forwarding_number: [''],
      forwarding_by: [''],
      destination: ['Vendor'], // Default value can be Vendor or Branch
      branch: [''],
      vendor: [''],
      status: ['', Validators.required],
      remarks: [''],
      driver_contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      total_packages: [{ value: 0 }, [Validators.required, Validators.min(1)]],
      total_weight: [{ value: 0 }, [Validators.required, Validators.min(0.1)]],
      vehicle_number: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      
    });

  }

  // Form control getters
  get origin() { return this.manifestForm.get('origin'); }
  get manifest_number() { return this.manifestForm.get('manifest_number'); }
  get date() { return this.manifestForm.get('date'); }
  get status() { return this.manifestForm.get('status'); }
  get driver_contact() { return this.manifestForm.get('driver_contact'); }
  get total_packages() { return this.manifestForm.get('total_packages'); }
  get total_weight() { return this.manifestForm.get('total_weight'); }
  get vehicle_number() { return this.manifestForm.get('vehicle_number'); }
  get driver_name() { return this.manifestForm.get('driver_name'); }

  ngOnInit(): void {
   
    this.data = this.route.snapshot.paramMap.get('id');
    console.log("data", this.data)
    if (this.data) {
      this.service.getEditValue(this.data).subscribe((res) => {
        console.log('edit value', res);
        if (res.data && res.data.length > 0) {
          const manifest = res.data[0];
          this.nidds = manifest.id
          // Assign packages separately if it's a FormArray
          this.packages = manifest.packages || [];

          const date = new Date(manifest.date);
          let value = date.toISOString().split('T')[0];
          this.manifestForm.patchValue({
            manifest_number: manifest.manifest_number || '',
            date: value || '',
            origin: manifest.origin || '',
            destination: manifest.destination || '',
            vehicle_number: manifest.vehicle_number || '',
            driver_name: manifest.driver_name || '',
            driver_contact: manifest.driver_contact || '',
            total_packages: manifest.total_packages || 0,
            total_weight: manifest.total_weight || 0,
            status: manifest.status || '',
            remarks: manifest.remarks || '',
            forwarding_number: manifest.forwarding_number || '',
            forwarding_by: manifest.forwarding_by || '',
            tracking_number: manifest.tracking_number || '',
            drs_sheet_no: manifest.drs_sheet_no || '',
            drs_sheet_date: manifest.drs_sheet_date || '',
            delivery_boys_name: manifest.delivery_boys_name || '',
            delivery_boys_contact: manifest.delivery_boys_contact || ''
          });

          // Patch conditional field based on destination
          if (manifest.destination === 'Branch') {
            this.manifestForm.patchValue({
              branch: manifest.branch || ''
            });
          } else if (manifest.destination === 'Vendor') {
            this.manifestForm.patchValue({
              vendor: manifest.vendor || ''
            });
          }
        }

      });
    }

    this.getData();
    this.getSepment();
    this.manifestForm.valueChanges.subscribe(() => {
      this.matchTracking()
    })

    this.getAvailableShipments();
    this.vanderservice.getService().subscribe(res => {
      console.log("value is vander", res)
      this.vendorList = res
    })
  }

  matchTrack: boolean = false;
  matchTracking() {
    const oldMatch = this.trackingOptions.find((v: any) => v.tracking_number === this.manifestForm.value.tracking_number)
    this.matchTrack = oldMatch
  }
  getSepment() {
    this.shipment.getService().subscribe(res => {
      console.log(res)
      this.trackingOptions = res
    })
  }
  getData() {
    this.service.getService().subscribe(res => {
      console.log(res)
      this.data = res
    })
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePic = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onProfilePicChange(): void {
    this.fileInput.nativeElement.click();
  }

  getAvailableShipments() {
    // In a real application, this would fetch available shipments from the API
    // For demo purposes, we'll use some sample data
    this.availableShipments = [
      { tracking_number: 'TRK001', weight: 8.2 },
      { tracking_number: 'TRK002', weight: 12.5 },
      { tracking_number: 'TRK003', weight: 7.5 },
      { tracking_number: 'TRK004', weight: 10.2 },
      { tracking_number: 'TRK005', weight: 8.5 }
    ];
  }

  addPackage(trackingNumber: string) {
    const shipment = this.availableShipments.find(s => s.tracking_number === trackingNumber);
    if (shipment && !this.packages.find(p => p.tracking_number === trackingNumber)) {
      this.packages.push({
        tracking_number: shipment.tracking_number,
        weight: shipment.weight,
        status: 'Pending'
      });
      this.updateTotals();
    }
  }

  removePackage(trackingNumber: string) {
    this.packages = this.packages.filter(p => p.tracking_number !== trackingNumber);
    this.updateTotals();
  }

  updateTotals() {
    const totalPackages = this.packages.length;
    const totalWeight = this.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    this.manifestForm.patchValue({
      total_packages: totalPackages,
      total_weight: totalWeight
    });
  }

  onSubmit(): void {
    if (this.manifestForm.invalid) {
      this.manifestForm.markAllAsTouched();
      return;
    }

    const formData = this.manifestForm.getRawValue(); // Includes disabled fields
    console.log('Submitted data:', formData);
    if (formData) {
      if (this.nidds > 0) {
        this.service.updateService(formData, this.nidds).subscribe(res => {
          console.log("update", res)
          this.nidds = null
          this.router.navigate(['manifest/manifest'])
        }, err => {
          console.log(err)
        })
      } else {
        this.service.saveService(formData).subscribe(res => {
          console.log("save", res)
          this.router.navigate(['manifest/manifest'])
        }, err => {
          console.log(err)
        })
      }
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  onCancel(): void {
    this.manifestForm.reset();
    this.profilePic = null; // Reset profile picture
    this.router.navigate(['/manifest/manifest']);
  }

  onBack(): void {
    this.router.navigate(['/manifest/manifest']); // Navigate back to member list or previous page
  }
}

