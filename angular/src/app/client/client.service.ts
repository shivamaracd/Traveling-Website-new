import { Injectable } from '@angular/core';
import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { uploadsounds } from '../app-routing.module';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'client';
  }

  //below are services this is only for understanding

  public ParticulerExcData(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getParticulerExcData';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }

  saveClient(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'saveClient';
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

  getLastClientId(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getLastClientId';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }
}
