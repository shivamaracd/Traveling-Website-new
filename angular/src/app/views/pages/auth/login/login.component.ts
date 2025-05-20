import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToasterService } from 'src/app/service/toaster.service';
import { ExecutiveService } from 'src/app/service/view.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: any = FormGroup;
  public submitted: boolean = false;
  public showPassword: boolean;
  public passwordshown: boolean = false;
  public isLoading: boolean = false;
  public password;
  public show = false;
  public btn: any = "Log In"
  constructor(protected router: Router, protected fb: FormBuilder, public __service: AuthService, public _toast: ToasterService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    })
  }

  onLogin() {
    this.isLoading = true;
    this.submitted = true;
    if (this.loginForm.invalid) {
      this._toast.displayAlert({ type: "error", msg: "Enter Username and Password", data: "", duration: 3000 });
      return false;
    } else {
      // this.ngxLoader.start()
      this.btn = "Logging..."
      this.__service.userLogin(this.loginForm.value).subscribe(
        res => {
          if (res.error == 1) {
            console.log("shivam::", res)
            this.router.navigate(['/dashboard'])
            sessionStorage.setItem('token', res.data.authkey)
            sessionStorage.setItem('username', res.data.username)
            sessionStorage.setItem('type', res.data.type)
            sessionStorage.setItem('iduser', res.data.id)
            this._toast.displaySuccess(res.message)
          } else {
            this.btn = "Log In"
            this._toast.displayError(res.message)
          }
        },
        err => {
          this.btn = "Log In"
          console.log(err)
          // this._toast.displayError(err.message)
        }
      )
    }
    // this.ngxLoader.stop();
  }

  togglepass() {
    this.passwordshown = !this.passwordshown;
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  get f() { return this.loginForm.controls; }

}
