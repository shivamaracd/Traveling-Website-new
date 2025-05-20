import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from '../service/AppService.class';
// import { AppService } from '../service/AppService.class';


@Injectable({
  providedIn: 'root'
})
export class AuthService  extends AppService<any>  {

  constructor(protected override http:HttpClient) {
    super(http)
    this.appmod = 'login'
  }

  logout(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = "logout";
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  forgotpassword(data: any): Observable<any> {
    return this.http.post<any>(environment.SERVER + "forgotpassword", data);
  }

  confirmationotp(data: any): Observable<any> {
    return this.http.post<any>(environment.SERVER + "confirmationotp", data);
  }

  update_password(data: any): Observable<any> {
    return this.http.put<any>(environment.SERVER + "updatepassword", data)
  }

  change_password(data: any): Observable<any> {
    return this.http.put<any>(environment.SERVER + "updatepassword", data)
  }

  registration(data: any): Observable<any> {
    return this.http.post<any>(environment.SERVER + "signup", data)
  }

  userLogin(data: any): Observable<any>  {
    return this.http.post<any>(environment.SERVER + "loginuser", data)
  }

}
