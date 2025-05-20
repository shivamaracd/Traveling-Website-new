

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';
import { BranchService } from '../branch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {
  GeneratedBranchId: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  branchForm!: FormGroup;
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
    private service: BranchService
  ) {
    this.branchForm = this.fb.group({
      branch_name: ['', Validators.required],
      branch_description: [''],
      branch: [''],
      contact_person: ['', Validators.required],
      branch_address: [''],
      branch_address2: ['', Validators.required],
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
    this.service.editDataBranch(this.data).subscribe((res: any) => {
      console.log('edit value', res);
      this.idss = res.data[0].id;
      this.branchForm.patchValue({
        branch_name: res.data[0].branch_name,
        branch_description: res.data[0].branch_description,
        branch_address: res.data[0].branch_address,
        branch_address2: res.data[0].branch_address2,
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
    this.GeneratedBranchId = '';

    // Check if this is a new client or editing existing
    if (!this.data) {
      // Generate a new client ID for new clients
      this.generateVendorId();
    } else {
      // For existing clients, fetch the ID from the response
      this.service.editDataBranch(this.data).subscribe((res:any) => {
        if (res.data && res.data.length > 0) {
          this.GeneratedBranchId = res.data[0].branch_id || 'N/A';
        }
      });
    }
  }

  // Method to generate a unique client ID
  generateVendorId(): void {
    // Format: CL followed by a 6-digit sequential number (CL000001)
    this.service.getLastBranchId().subscribe(
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
        this.GeneratedBranchId = `BR${formattedNumber}`;
      },
      (error: any) => {
        console.error('Error fetching last client ID:', error);
        // Fallback in case of error
        this.GeneratedBranchId = 'BR000001';
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
    console.log('Form Data:', this.branchForm.value);
    if (this.branchForm.valid) {
      if (this.data && this.idss) {
        console.log('edit', this.data, this.branchForm.value);
        let value = { id: this.idss, data: this.branchForm.value };
        this.ngxLoader.start();
        this.service.updateBranchData(value).subscribe((res: any) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Branch Update Successfully',
          });
          this.router.navigate(['/branch/branch']);
          this.ngxLoader.stop();
          this.idss = null;
        });
      } else {
        this.ngxLoader.start();
        this.service.saveBranchData(this.branchForm.value).subscribe((res) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Branch Post Successfully',
          });
          this.router.navigate(['/branch/branch']);
          this.ngxLoader.stop();
        });
      }
    } else {
      this.validateAllFormFields(this.branchForm); // Show error messages for invalid fields
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
    this.branchForm.reset();
    this.profilePic = null; // Reset profile picture
    this.router.navigate(['/branch/branch']);
  }

  onBack(): void {
    this.router.navigate(['/branch/branch']); // Navigate back to member list or previous page
  }
}




