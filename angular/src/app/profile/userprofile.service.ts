import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppService } from '../views/pages/service/AppService.class';
import { environment } from 'src/environments/environment';
import { companyDoc, imgupload } from '../app-routing.module';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService extends AppService<any> {

    constructor(protected override http: HttpClient) {
      super(http)
      this.appmod = 'userprofile'
    }

  tempProfile = new Subject();


  public uploadFile(data: any): Observable<any> {
    console.log(data)
    return this.http.post(`${imgupload}`, data)
  }

    public uploadCompanyDocs(data: any): Observable<any> {
    console.log(data)
    return this.http.post(`${companyDoc}`, data)
  }

  public saveProfile(data: any): Observable<any> {
    this.appmod = "saveprofile";
    let result = super.saveService(data);
    this.appmod = "userprofile"
    return result;
  }

  public getProfile(id: any): Observable<any> {
    console.log("id here ::", id);
    this.appmod = "getprofile";
    let result = super.getService(id);
    this.appmod = "userprofile"
    return result;
  }

  public updateProfileData(data: any, id: number): Observable<any> {
    this.appmod = "update_profile";
    let result = super.updateService(data, id);
    this.appmod = "userprofile"
    return result;
  }


  public updatePasswords(data: any, id: number): Observable<any> {
    this.appmod = "updatepassword";
    let result = super.updateService(data, id);
    this.appmod = "userprofile"
    return result;
  }

  public changePassword(data: any, id: number): Observable<any> {
    this.appmod = "change_password";
    let result = super.updateService(data, id);
    this.appmod = "userprofile"
    return result;
  }

  public forgotpassword(data: any): Observable<any> {
    return this.http.post<any>(environment.SERVER + "forgotpassword", data);
  }

  public chnagepasss(data: any): Observable<any> {
    this.appmod = "updatepasswordpro";
    let result = super.saveService(data);
    this.appmod = "userprofile"
    return result;
  }

   public deleteCompanyUp(data:any): Observable<any> {
    this.appmod = "deleteCompanyUpload";
    let result = super.saveService(data);
    this.appmod = "userprofile"
    return result;
  }

}


