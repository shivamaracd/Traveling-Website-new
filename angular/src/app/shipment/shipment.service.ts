import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { uploadsounds } from '../app-routing.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'shipment';
  }

  getShipemntdata(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getShipemntdata';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  updateShipment(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updateShipment';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }
}
