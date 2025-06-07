import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'deliveryNew';
  }

  editDataShipment(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editDataShipment';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  getDeliveryStatus(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getDeliveryStatus';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }

  saveDeliverydata(data: any): Observable<any> {
    console.log(data)
    let tmp = this.appmod;
    this.appmod = 'saveDeliverydata';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  getDeliveryData(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getDeliveryData';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }

  deleteDelivery(data:any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'deleteDelivery';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  getDataTracking(data:any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getDataTracking';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }
}



