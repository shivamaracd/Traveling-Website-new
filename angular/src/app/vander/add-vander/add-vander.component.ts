import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';
import { VanderService } from '../vander.service';

@Component({
  selector: 'app-add-vander',
  templateUrl: './add-vander.component.html',
  styleUrls: ['./add-vander.component.scss']
})
export class AddVanderComponent implements OnInit {
  GeneratedVendorId: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  vendorForm!: FormGroup;
  emailError: string = '';
  profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';
  idss: any;
  constructor(
    private toest: NgToastService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private service: VanderService
  ) {
    this.vendorForm = this.fb.group({
      vandor_name: ['', Validators.required],
      vander_description: [''],
      branch: [''],
      contact_person: ['', Validators.required],
      vander_address: [''],
      vander_address2: ['', Validators.required],
      country: ['', Validators.required],
      state: [''],
      city: [''],
      pincode: [''],
      email: ['', [Validators.email]],
      mobile_no: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      gst_no: [''],
  
      // Bank Details
      bank_name: [''],
      account_number: [''],
      account_name: [''],
      ifsc_code: ['', [Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      bank_city: [''],
      bank_state: [''],
      bank_country: [''],
      bank_pincode: [''],
      bank_email: ['', [Validators.email]]
    });
  }
  data: any;
  ngOnInit(): void {
    this.data = this.route.snapshot.paramMap.get('id');
    console.log(this.data);
    this.service.editData(this.data).subscribe((res: any) => {
      console.log('edit value', res);
      this.idss = res.data[0].id;
      this.vendorForm.patchValue({
        vandor_name: res.data[0].vandor_name,
        vander_description: res.data[0].vander_description,
        vander_address: res.data[0].vander_address,
        vander_address2: res.data[0].vander_address2,
        mobile_no: res.data[0].mobile_no,
        city: res.data[0].city,
        pincode: res.data[0].pincode,
        gst_no: res.data[0].gst_no,
        email: res.data[0].email,
        bank_name: res.data[0].bank_name,
        account_name: res.data[0].account_name,
        account_number: res.data[0].account_number,   // ✅ Missing field added
        ifsc_code: res.data[0].ifsc_code,
        branch: res.data[0].branch,
        country: res.data[0].country,
        state: res.data[0].state,
        contact_person: res.data[0].contact_person,
        bank_city: res.data[0].bank_city,
        bank_state: res.data[0].bank_state,
        bank_country: res.data[0].bank_country,
        bank_pincode: res.data[0].bank_pincode,
        bank_email: res.data[0].bank_email
      });
      
    });

    // Generate client ID property
    this.GeneratedVendorId = '';

    // Check if this is a new client or editing existing
    if (!this.data) {
      // Generate a new client ID for new clients
      this.generateVendorId();
    } else {
      // For existing clients, fetch the ID from the response
      this.service.editData(this.data).subscribe((res) => {
        if (res.data && res.data.length > 0) {
          this.GeneratedVendorId = res.data[0].vendor_id || 'N/A';
        }
      });
    }
  }

  // Method to generate a unique client ID
  generateVendorId(): void {
    // Format: CL followed by a 6-digit sequential number (CL000001)
    this.service.getLastVendorId().subscribe(
      (lastId: any) => {
        let nextNumber = 1; // Default start with 1

        if (lastId && lastId.length > 2) {
          // Extract the numeric part and increment
          const numericPart = parseInt(lastId.substring(2), 10);
          if (!isNaN(numericPart)) {
            nextNumber = numericPart + 1;
          }
        }

        // Format with leading zeros to ensure 6 digits
        const formattedNumber = nextNumber.toString().padStart(6, '0');
        this.GeneratedVendorId = `VD${formattedNumber}`;
      },
      (error: any) => {
        console.error('Error fetching last client ID:', error);
        // Fallback in case of error
        this.GeneratedVendorId = 'VD000001';
      }
    );
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

  onSubmit() {
    console.log('Form Data:', this.vendorForm.value);
    if (this.vendorForm.valid) {
      if (this.data && this.idss) {
        console.log('edit', this.data, this.vendorForm.value);
        let value = { id: this.idss, data: this.vendorForm.value };
        this.ngxLoader.start();
        this.service.updateVendorData(value).subscribe((res: any) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Vendor Update Successfully',
          });
          this.router.navigate(['/vander/vander']);
          this.ngxLoader.stop();
          this.idss = null;
        });
      } else {
        this.ngxLoader.start();
        this.service.saveService(this.vendorForm.value).subscribe((res) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Post Successfully',
          });
          this.router.navigate(['/vander/vander']);
          this.ngxLoader.stop();
        });
      }
    } else {
      this.validateAllFormFields(this.vendorForm); // Show error messages for invalid fields
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
    this.vendorForm.reset();
    this.profilePic = null; // Reset profile picture
    this.router.navigate(['/vander/vander']);
  }

  onBack(): void {
    this.router.navigate(['/vander/vander']); // Navigate back to member list or previous page
  }
}




