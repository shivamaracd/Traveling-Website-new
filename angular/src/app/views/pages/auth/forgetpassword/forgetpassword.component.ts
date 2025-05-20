import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/service/toaster.service';
import { ProfileService } from 'src/app/service/view.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {
  public forgetPasswordForm: any = FormGroup;
  public otpForm: any = FormGroup;
  public changePasswordForm: any = FormGroup;
  public submitted: boolean = false;
  showOtp: boolean = false;
  hideforgetmail: number = 1;
  validemail: any;
  wrongotp: number = 0;
  showchangepassword: number = 1;
  changepasswordid: any;

  constructor(private router: Router, protected fb: FormBuilder, public _toast: ToasterService, protected _service: AuthService, protected profileservice: ProfileService) { }

  get f() { return this.changePasswordForm.controls }
  get g() { return this.otpForm.controls }
  get h() { return this.forgetPasswordForm.controls }

  ngOnInit() {
    this.forgetPasswordForm = this.fb.group({
      email: new FormControl('', Validators.required),
    })

    this.otpForm = this.fb.group({
      otp: new FormControl('', Validators.required),
    })

    this.changePasswordForm = this.fb.group({
      password: new FormControl('', Validators.required),
      confirmpassword: new FormControl('', Validators.required),
    }, {
      validators: this.MustMatch('password', 'confirmpassword')
    })
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.MustMatch) {
        return
      }
      if (control.value != matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true })
      }
      else {
        matchingControl.setErrors(null);
      }
    }
  }

  forgetClick() {
    console.log("forget::",this.forgetPasswordForm.value)
    this.submitted = true
    this.showOtp = false;
    if(this.forgetPasswordForm.invalid){
      return false
    }
    this._service.forgotpassword(this.forgetPasswordForm.value).subscribe(res => {
      console.log("save data::", res)
      console.log("save data::", res.error);
      this.hideforgetmail = res.error;
      console.log(this.hideforgetmail);
      this._toast.displaySuccess(res.message)
      this.validemail = this.forgetPasswordForm.value.email;
    }, err => {
      this._toast.displayError(err.message)
    })
    this.submitted = false
  }



  otpClick() {
    this.otpForm.value.email = this.validemail;
    console.log('OTP from form', this.otpForm.value);
    this.submitted = true;
    if(this.otpForm.invalid){
      return false
    }
    this._service.confirmationotp(this.otpForm.value).subscribe(res => {
      console.log('otp', res);
      this.wrongotp = res.error;
      this.showchangepassword = res.error;
      this._toast.displaySuccess(res.message)
    },
    err=>{
      this._toast.displayError(err.message)
    })
    this.submitted=false;
  }

  changePassword() {
    console.log("Change password form value", this.changePasswordForm.value);

    this.submitted=true;
    if(this.changePasswordForm.invalid){
      return false;
    }
    if (this.changePasswordForm.value.password === this.changePasswordForm.value.confirmpassword) {
      console.log('password match');
      
    this.profileservice.changePassword({password:this.changePasswordForm.value.password,email:this.validemail}, 111).subscribe(res => {
      console.log('change password', res);
      this._toast.displaySuccess(res.message)
      this.router.navigate(['/auth/login']);
    }, err=>{
      this._toast.displayError(err.message)
    })
    }
    else {
      console.log('password & confirm password does not match');
    }
  }

}
