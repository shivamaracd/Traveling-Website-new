import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ClientService } from 'src/app/client/client.service';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.scss'],
})
export class AddTaxComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  taxForm!: FormGroup;
  emailError: string = '';
  profilePic: string | null = null;
  defaultPic: string = '../../../assets/images/image/user-profile.png';
  constructor(
    private toest: NgToastService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private service: SettingService
  ) {
    this.taxForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile_no: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      annual_income: ['', Validators.required],
      taxable_income: ['', Validators.required],
      tax_due: ['', Validators.required]
    });
    
  }
  data: any;
  ngOnInit(): void {
    
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
    if (this.taxForm.valid) {
      // console.log('Form Data:', this.taxForm.value);
      if (this.data) {
        console.log('edit', this.data, this.taxForm.value);
        // let value = { id: this.data, data: this.taxForm.value };
        // this.ngxLoader.start();
        // this.service.editClient(value).subscribe((res) => {
        //   console.log(res);
        //   this.toest.success({
        //     detail: res.message,
        //     summary: 'Post Successfully',
        //   });
        //   this.router.navigate(['/setting/tax']);
        //   this.ngxLoader.stop();
        // });
      } else {
        // this.ngxLoader.start();
      console.log('Form Data:', this.taxForm.value);
        
        this.service.saveService(this.taxForm.value, "tax").subscribe((res) => {
          console.log(res);
          this.toest.success({
            detail: res.message,
            summary: 'Post Successfully',
          });
          this.router.navigate(['/setting/tax']);
          this.ngxLoader.stop();
        });
      }
    } else {
      this.validateAllFormFields(this.taxForm); // Show error messages for invalid fields
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
    this.taxForm.reset();
    this.profilePic = null; // Reset profile picture
    this.router.navigate(['/setting/tax']);
  }

  onBack(): void {
    this.router.navigate(['/setting/tax']); // Navigate back to member list or previous page
  }
}
