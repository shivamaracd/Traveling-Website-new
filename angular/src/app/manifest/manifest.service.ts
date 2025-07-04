import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManifestService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'manifest';
  }

  public getEditValue(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getEditValuemanifest';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public saveDRSData(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'saveDRSData';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public getDrsManifest(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getDrsManifest';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }

  public getEditValuedrs(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getEditValuedrs';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public updateDRSData(data: any, id: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updateDRSData';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  public deleteDRSData(id: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'deleteDRSData';
    let result = super.saveService(id);
    this.appmod = tmp;
    return result;
  }
}

