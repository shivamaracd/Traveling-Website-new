import { Injectable } from '@angular/core';
import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaseServiceService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'case';
  }

  public ParticulerExcData(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getParticulerExcData';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }

  saveCase(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'saveCase';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  editData(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editData';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  editClient(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editClient';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }
}
