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
  manifestForm!: FormGroup;
  trackingOptions: any
  emailError: string = '';
  profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';
  data: any;
  packages: any[] = [];
  availableShipments: any[] = [];
vendorList: any = []
  constructor(
    private toest: NgToastService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private service: ManifestService,
    private shipment: ShipmentService,
    private vanderservice:VanderService
  ) {
    this.manifestForm = this.fb.group({
      tracking_number: [''],
      manifest_number: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      date: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      vehicle_number: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      driver_name: ['', [Validators.required]],
      driver_contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      total_packages: ['', [Validators.required, Validators.min(1)]],
      total_weight: ['', [Validators.required, Validators.min(0)]],
      status: ['Pending', [Validators.required]],
      remarks: [''],
      packages: [[]]
    });
  }

  // Form control getters
  get f() { return this.manifestForm.controls; }
  get manifest_number() { return this.manifestForm.get('manifest_number'); }
  get date() { return this.manifestForm.get('date'); }
  get origin() { return this.manifestForm.get('origin'); }
  get destination() { return this.manifestForm.get('destination'); }
  get vehicle_number() { return this.manifestForm.get('vehicle_number'); }
  get driver_name() { return this.manifestForm.get('driver_name'); }
  get driver_contact() { return this.manifestForm.get('driver_contact'); }
  get total_packages() { return this.manifestForm.get('total_packages'); }
  get total_weight() { return this.manifestForm.get('total_weight'); }
  get status() { return this.manifestForm.get('status'); }

  ngOnInit(): void {
    this.data = this.route.snapshot.paramMap.get('id');
    if (this.data) {
      this.service.editDataManifest(this.data).subscribe((res) => {
        console.log('edit value', res);
        if (res.data && res.data.length > 0) {
          const manifest = res.data[0];
          this.packages = manifest.packages || [];
          this.manifestForm.patchValue({
            manifest_number: manifest.manifest_number,
            date: manifest.date,
            origin: manifest.origin,
            destination: manifest.destination,
            vehicle_number: manifest.vehicle_number,
            driver_name: manifest.driver_name,
            driver_contact: manifest.driver_contact,
            total_packages: manifest.total_packages,
            total_weight: manifest.total_weight,
            status: manifest.status,
            remarks: manifest.remarks,
            packages: manifest.packages
          });
        }
      });
    }

    this.getData();
    this.getSepment();
    this.manifestForm.valueChanges.subscribe(() => {
      this.matchTracking()
    })

    this.getAvailableShipments();
    this.vanderservice.getService().subscribe(res=>{
      console.log("value is vander",res)
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

  onSubmit() {
    // Mark all fields as touched to show validation messages
    this.validateAllFormFields(this.manifestForm);
    console.log("form", this.manifestForm.value)
    // if (this.manifestForm.valid && this.packages.length > 0) {
    //   const formData = {
    //     ...this.manifestForm.value,
    //     packages: this.packages
    //   };

    //   if (this.data) {
    //     // Edit mode
    //     this.ngxLoader.start();
    //     this.service.editDataManifest({ id: this.data, data: formData }).subscribe({
    //       next: (res) => {
    //         this.toest.success({
    //           detail: res.message,
    //           summary: 'Updated Successfully',
    //         });
    //         this.router.navigate(['manifest/manifest']);
    //         this.ngxLoader.stop();
    //       },
    //       error: (err) => {
    //         console.error(err);
    //         this.toest.error({
    //           detail: 'Failed to update manifest',
    //           summary: 'Error'
    //         });
    //         this.ngxLoader.stop();
    //       }
    //     });
    //   } else {
    //     // Create mode
    //     this.ngxLoader.start();
    //     this.service.saveService(formData).subscribe({
    //       next: (res) => {
    //         this.toest.success({
    //           detail: res.message,
    //           summary: 'Saved Successfully',
    //         });
    //         this.router.navigate(['manifest/manifest']);
    //         this.ngxLoader.stop();
    //       },
    //       error: (err) => {
    //         console.error(err);
    //         this.toest.error({
    //           detail: 'Failed to save manifest',
    //           summary: 'Error'
    //         });
    //         this.ngxLoader.stop();
    //       }
    //     });
    //   }
    // } else {
    //   this.toest.error({
    //     detail: this.packages.length === 0 ? "Please add at least one package" : "Please fill all required fields correctly",
    //     summary: 'Validation Error'
    //   });
    // }
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

