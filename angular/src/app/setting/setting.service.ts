import { Injectable } from '@angular/core';
import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class SettingService  extends AppService<any> {

  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'setting';
  }

  public editValue(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editcashstatus';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public updateCashstatus(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updatecashstatus';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public updateStatus(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updateStatus';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public updateCourt(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updateCourt';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public updatejudge(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updatejudge';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }
}
