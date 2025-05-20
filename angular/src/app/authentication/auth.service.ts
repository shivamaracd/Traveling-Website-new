import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from '../shared/service/AppService.class';
@Injectable({
  providedIn: 'root'
})
export class AuthenticatonService extends AppService<any> {

  constructor(protected override http:HttpClient) {
    super(http)
    this.appmod = 'login'
  }

  // public logout(id: number): Observable<any> {
  //   this.appmod = 'logout';
  //   let result = super.deleteService(id);
  //   this.appmod = "login";
  //   return result;
  // }

  // public forgotpassword(data: any): Observable<any> {
  //   return this.http.post<any>(environment.SERVER + "forgotpassword", data);
  // }

  // public confirmationotp(data: any): Observable<any> {
  //   return this.http.post<any>(environment.SERVER + "confirmationotp", data);
  // }

  // public update_password(data: any): Observable<any> {
  //   return this.http.put<any>(environment.SERVER + "updatepassword", data)
  // }

  // public change_password(data: any): Observable<any> {
  //   return this.http.put<any>(environment.SERVER + "updatepassword", data)
  // }

  // public registration(data: any): Observable<any> {
  //   return this.http.post<any>(environment.SERVER + "signup", data)
  // }

  public userLogin(data: any): Observable<any>  {
    console.log("login data", data)
    return this.http.post<any>(environment.SERVER + "loginuser", data)
  }

}
