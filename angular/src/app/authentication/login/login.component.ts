import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticatonService } from '../auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  btn: any = "Login"
  constructor(private toest:NgToastService,private fb: FormBuilder, private router: Router, public service:AuthenticatonService) {
    // Create login form with form controls
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  ngOnInit(): void {}

  // Getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  // Handle form submission
  onSubmit() {
    this.btn = "Logging..."

    this.submitted = true;

    // If form is invalid, return
    if (this.loginForm.invalid) {
      return;
    }
    console.log('Login successful!', this.loginForm.value);
    // alert('Login Successful')
    // this.router.navigate(['/dashboard']);
    // this.router.navigate(['/view']);

    // if (this.loginForm.invalid) {
    //   // this._toast.displayAlert({ type: "error", msg: "Enter Username and Password", data: "", duration: 3000 });
    // alert('Enter Username and Password')
    //   return false;
    // } else {
      this.btn = "Logging..."
      this.service.userLogin(this.loginForm.value).subscribe( res => {
          if (res.status == 200) {
            console.log("shivam::", res)
            this.router.navigate(['/dashboard']);
            sessionStorage.setItem('token', res.data.authkey);
            sessionStorage.setItem('username', res.data.username);
            sessionStorage.setItem('type', res.data.type);
            sessionStorage.setItem('iduser', res.data.id);
            sessionStorage.setItem('balance', res.data.balance);
            sessionStorage.setItem('plan', res.data.plan);
            sessionStorage.setItem('idparent', res.data.idparent);
            sessionStorage.setItem('idaccount', res.data.idaccount);
            sessionStorage.setItem('profile_image', res.data.profile_image);
            // this._toast.displaySuccess(res.message)
            this.toest.success({detail:"Success Message",summary:res.message	})

            // alert(res.message)
          } else {
            this.btn = "Login"
            // this._toast.displayError(res.message)
            alert(res.message)
          }
        },
        err => {
          this.btn = "Login"
          console.log(err)
          // this._toast.displayError(err);
          alert("Something Went wrong!")
        });
    }
  }

