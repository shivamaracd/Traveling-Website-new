import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../auth/auth.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserprofileService } from '../userprofile.service';
// import { ToasterService } from 'src/app/service/toaster.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public editProfileForm!: FormGroup;
  public target: string = environment.SERVER;
  public changePasswordForm!: FormGroup;
  public profileresult: any = [];
  public updateid: any;
  public profileimage: any = [];
  public file!: File;
  public fileName = '';
  public size!: number;
  public file1: File[] = [];
  public files1: any;
  public errmsg1!: string;
  public submitted!: boolean;
  public password!: string;
  public show = false;
  public newpassword!: string;
  public passwordshow = false;
  public conpassword!: string;
  public show2 = false;
  public oldPassword: any;
  public userType = Number(sessionStorage.getItem('type'));
  public company_certificate: any;
  public company_pan_card: any;
  public director_pan_card: any;

 constructor(
    private ngxLoader: NgxUiLoaderService, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private router: Router, private modalService: NgbModal, protected fb: FormBuilder, private profileservice: UserprofileService,  private toaster:NgToastService) {
    this.editProfileForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contact: ['', [Validators.required]],
    });

    this.changePasswordForm = this.fb.group(
      {
        // id: [''],
        oldpassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmpassword: ['', [Validators.required, Validators.minLength(4)]],
      },
      {
        validators: this.MustMatch('password', 'confirmpassword'),
      }
    );
  }

  ngOnInit() {
    this.refreshprofile();
    this.password = 'password';
    this.newpassword = 'password';
    this.conpassword = 'password';
    // this.uploadCompany();
  }


//   public deleteImage(type: number) {
//   if (window.confirm('Are you sure you want to delete?')) {
//   let ṭypes = Number(type);
//   let data = {docDetail : ṭypes }
//     this.profileservice.deleteCompanyUp(data).subscribe(res =>{
//       if(data.docDetail == 20){ document.getElementById('99').click()}
//       else if(data.docDetail == 21){ document.getElementById('100').click()}
//       else if(data.docDetail == 22){ document.getElementById('101').click()};
//       this._toast.displaySuccess(res.message);
//       this.ngOnInit();
//     })
//   }else{
//       if(type == 20){ document.getElementById('99').click()}
//       else if(type == 21){ document.getElementById('100').click()}
//       else if(type == 22){ document.getElementById('101').click()};
//   }
// }

//   public uploadCompany(){
//     this.profileservice.getService('uploadProfile').subscribe(res => {
//       let uploadCompanyData = res[0];
//       this.company_certificate = uploadCompanyData.company_certificate;
//       this.company_pan_card = uploadCompanyData.company_pan_card;
//       this.director_pan_card = uploadCompanyData.director_pan_card;
//     })
//   }

  public onKeyDown(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement) {
      const inputElement = event.target;
      if (
        inputElement.value.length >= 10 &&
        event.keyCode !== 8 &&
        event.keyCode !== 46
      ) {
        event.preventDefault();
      }
    }
  }

  // public onFileSelect(event: { target: { files: (File | undefined)[]; }; }) {
  //   this.file = event.target.files[0];
  //   console.log(this.file);
  //   const extension = this.file.name.split('.').pop();
  //   const fileSizeInBytes = this.file.size;
  //   const fileSizeInKB = fileSizeInBytes / 1024;
  //   const fileSizeInMB = fileSizeInKB / 1024;

  //   this.onUpload();
  //   // if (extension == 'jpg') {
  //   // } else {
  //   //   this.errmsg1 = 'This file type not acceptable , Acceptable file types are (mp3)';
  //   // }
  // }



  public onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (!input.files || input.files.length === 0) {
      console.error('No file selected!');
      this.errmsg1 = 'No file selected. Please choose a file.';
      return;
    }
  
    this.file = input.files[0]; // Assign the selected file
    
    const extension = this.file.name.split('.').pop();
    const fileSizeInBytes = this.file.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;
  
    console.log(`Extension: ${extension}, Size: ${fileSizeInMB.toFixed(2)} MB`);
  
    // Example validation
    if (extension === 'jpg' || extension === 'png') {
      this.onUpload(); // Call the upload method if file type is acceptable
    } else {
      this.errmsg1 = 'This file type is not acceptable. Acceptable file types are (jpg, png)';
    }
  }
  
  

  public onUpload() {
    this.ngxLoader.start();
    const formData = new FormData();
    formData.append('filename', this.file);
    formData.append('type', '20');
    this.profileservice.uploadFile(formData).subscribe((res: any) => {
      this.refreshprofile();
    });
    this.ngxLoader.stop();
  }

  //  public onFileSelected(event: { target: { files: (File | undefined)[]; }; }, id: number) {
  //   this.file = event.target.files[0];
  //   console.log(this.file);
  //   const extension = this.file.name.split('.').pop();
  //   const fileSizeInBytes = this.file.size;
  //   const fileSizeInKB = fileSizeInBytes / 1024;
  //   const fileSizeInMB = fileSizeInKB / 1024;

  //   this.ngxLoader.start();
  //   if(id== 20){
  //     var formData = new FormData();
  //     formData.append('filename', this.file);
  //     formData.append('type', '20');
  //   }else if(id == 21){
  //     var formData = new FormData();
  //     formData.append('filename', this.file);
  //   formData.append('type', '21');
  //   }else if(id == 22){
  //    var formData = new FormData();
  //   formData.append('filename', this.file);
  //   formData.append('type', '22');
  //   }
  //   this.profileservice.uploadCompanyDocs(formData).subscribe((res: any) => {
  //     this._toast.displaySuccess(res.message);
  //   });
  //   this.ngxLoader.stop();
  //   this.ngOnInit();
  // }


  public refreshprofile() {
    this.profileservice.getService().subscribe((res) => {
      this.profileimage =
        res[0].profile_image != null
          ? res[0].profile_image
          : 'user-profile.png';
      console.log(this.profileimage, 'called')
      this.profileservice.tempProfile.next(this.profileimage);
      this.profileresult = res[0];
      this.oldPassword = res[0].password;
      this.editProfileForm.patchValue({
        firstname: this.profileresult.firstname,
        lastname: this.profileresult.lastname,
        email: this.profileresult.email,
        contact: this.profileresult.contact,
      });
      this.updateid = res[0].id;
    });
  }

  public updateProfile() {
    this.submitted = true;
    if (this.editProfileForm.invalid) {
      return false;
    } else {
      this.profileservice.updateProfileData(this.editProfileForm.value, this.updateid).subscribe(
          (res) => {
            this.toaster.success({
              detail: res.message,
              summary: 'Updated Successfully',
            });            this.refreshprofile();
            this.submitted = false;
          },
          (err) => {
            // this._toast.displayError(err.message);
          }
        );
         // Return true at the end of the function to indicate success
    return true;
    }
  }

  public changepass() {
    this.submitted = true;
    if (this.changePasswordForm.invalid ) {
      return false;
    } else {
      this.profileservice.chnagepasss(this.changePasswordForm.value).subscribe(
        (res) => {
          if (res.error == 1) {
            // this._toast.displayError(res.message);
            this.submitted = false;
          } else {
            this.toaster.success({
              detail: res.message,
              summary: 'Updated Successfully',
            });            
             this.changePasswordForm.reset();
            this.submitted = false;
            this.refreshprofile();
          }
        },
        (err) => {
          // this._toast.displayError(err.message);
        }
      );
       // Return true at the end of the function to indicate success
    return true;
    }
  }

  public MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['MustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  public oldPass() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  public newPass() {
    if (this.newpassword === 'password') {
      this.newpassword = 'text';
      this.passwordshow = true;
    } else {
      this.newpassword = 'password';
      this.passwordshow = false;
    }
  }

  public conPass() {
    if (this.conpassword === 'password') {
      this.conpassword = 'text';
      this.show2 = true;
    } else {
      this.conpassword = 'password';
      this.show2 = false;
    }
  }

  get f() {
    return this.changePasswordForm.controls;
  }
  get h() {
    return this.editProfileForm.controls;
  }

}
