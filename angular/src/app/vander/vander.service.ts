import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { uploadsounds } from '../app-routing.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VanderService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'vander';
  }


  editDataShipment(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editDataShipment';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  editData(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editDataVendor';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  updateVendorData(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updateVendorData';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  getLastVendorId(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getLastVendorId';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }
}

