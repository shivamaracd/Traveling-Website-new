import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { ProfileService } from 'src/app/service/view.service';
import { AuthService } from '../../pages/auth/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { UserprofileService } from 'src/app/profile/userprofile.service';
// import { ToasterService } from 'src/app/service/toaster.service';
// import { UserprofileService } from 'src/app/userprofile/userprofile.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public iduser:any = sessionStorage.getItem("iduser");
  public token:any = sessionStorage.getItem("token");
  public currentName: any;
  public currentemail: any;
  public currentLastname: any;
  public target: string = environment.SERVER
  public tempTemp:any = [];
  profileimage: any = [];
  constructor(@Inject(DOCUMENT) private document: Document,private router: Router,protected fb: FormBuilder,public auth: AuthService, public _http: HttpClient, private profileSer: UserprofileService) { }
  ngOnInit() {
    this.refreshprofile()
   this.profileSer.tempProfile.subscribe(data=>{
    this.tempTemp = data;
   })

  }

  public refreshprofile() {
    this.profileSer.getService().subscribe((res) => {
      this.profileimage =
        res[0].profile_image != null
          ? res[0].profile_image
          : 'user-profile.png';
      console.log(this.profileimage, 'called')
      this.profileSer.tempProfile.next(this.profileimage);
      
    });
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  public toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  public onLogout(e: any) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');
    if (!localStorage.getItem('isLoggedin')) {
      this.auth.logout(JSON.stringify({'authkey':this.token})).subscribe(
        res => {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/auth/login']);
          // this._toast.displaySuccess(res.message)
        },
        err => {
          alert(err.message)
        }
      )
      // this.router.navigate(['/auth/login']);
    }
  }

  public routeProfile(){
    console.log("routeProfile");
    this.router.navigate(['/profile'])
  }
}
