import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../client.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {
  GeneratedClientId: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  clientForm!: FormGroup;
  emailError: string = '';
  profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';
  constructor(
    private toest: NgToastService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private service: ClientService
  ) {
    this.clientForm = this.fb.group({
      client_name: ['', [Validators.required]],
      client_description: [''],
      client_address: ['', [Validators.required]],
      client_address2: [''],
      mobile_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: ['', [Validators.required]],
      state: [''],
      country: [''],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      gst_no: ['', [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      email: ['', [Validators.required, Validators.email]],
      bank_name: [''],
      account_name: [''],
      account_number: [''],
      ifsc_code: ['', [Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      bank_city: [''],
      bank_state: [''],
      bank_country: [''],
      bank_pincode: [''],
      bank_email: [''],
      alias_name: [''],
      branch_name: [''],
      billing_company_name: [''],
      billing_company_address: [''],
    });
  }
  data: any;
  ngOnInit(): void {
    this.data = this.route.snapshot.paramMap.get('id');
    console.log(this.data);
    this.service.editData(this.data).subscribe((res) => {
      console.log('edit value', res);
      this.clientForm.patchValue({
          client_name: res.data[0].client_name,
          client_description: res.data[0].client_description,
          client_address: res.data[0].client_address,
          client_address2: res.data[0].client_address2,
          mobile_no: res.data[0].mobile_no,
          city: res.data[0].city,
          state: res.data[0].state,
          country: res.data[0].country,
          pincode: res.data[0].pincode,
          gst_no: res.data[0].gst_no,
          email: res.data[0].email,
          bank_name: res.data[0].bank_name,
          account_name: res.data[0].account_name,
          account_number: res.data[0].account_number,
          ifsc_code: res.data[0].ifsc_code,
          bank_city: res.data[0].bank_city,
          bank_state: res.data[0].bank_state,
          bank_country: res.data[0].bank_country,
          bank_pincode: res.data[0].bank_pincode,
          bank_email: res.data[0].bank_email,
          alias_name: res.data[0].alias_name,
          branch_name: res.data[0].branch_name,
          billing_company_name: res.data[0].billing_company_name,
          billing_company_address: res.data[0].billing_company_address,
      });
    });

    // Generate client ID property
    this.GeneratedClientId = '';
    
    // Check if this is a new client or editing existing
    if (!this.data) {
      // Generate a new client ID for new clients
      this.generateClientId();
    } else {
      // For existing clients, fetch the ID from the response
      this.service.editData(this.data).subscribe((res) => {
        if (res.data && res.data.length > 0) {
          this.GeneratedClientId = res.data[0].client_id || 'N/A';
        }
      });
    }
  }

  // Method to generate a unique client ID
  generateClientId(): void {
    // Format: CL followed by a 6-digit sequential number (CL000001)
    this.service.getLastClientId().subscribe(
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
        this.GeneratedClientId = `CL${formattedNumber}`;
      },
      (error: any) => {
        console.error('Error fetching last client ID:', error);
        // Fallback in case of error
        this.GeneratedClientId = 'CL000001';
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
    console.log('Form Data:', this.clientForm.value);
    if (this.clientForm.valid) {
      if (this.data) {
        console.log('edit', this.data, this.clientForm.value);
        let value = { id: this.data, data: this.clientForm.value };
        this.ngxLoader.start();
        this.service.editClient(value).subscribe((res) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Post Successfully',
          });
          this.router.navigate(['client/client']);
          this.ngxLoader.stop();
        });
      } else {
        console.log('new', this.clientForm.value);
        this.ngxLoader.start();
        this.service.saveService(this.clientForm.value).subscribe((res) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Post Successfully',
          });
          this.router.navigate(['client/client']);
          this.ngxLoader.stop();
        });
      }
    } else {
      this.validateAllFormFields(this.clientForm); // Show error messages for invalid fields
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
    this.clientForm.reset();
    this.profilePic = null; // Reset profile picture
    this.router.navigate(['/client/client']);
  }

  onBack(): void {
    this.router.navigate(['/client/client']); // Navigate back to member list or previous page
  }
}
