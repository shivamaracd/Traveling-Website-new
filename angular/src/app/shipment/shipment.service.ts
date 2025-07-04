import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { uploaddelivery } from '../app-routing.module';


@Injectable({
  providedIn: 'root',
})
export class ShipmentService extends AppService<any> {
  private apiUrl = environment.SERVER;

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

  previewBookingFile(formData: FormData): Observable<any> {
    // return this.http.post(`${this.apiUrl}/shipment/preview-booking-file`, formData);
    return this.http.post(`${uploaddelivery}`, formData)
  }

  // importBookings(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/shipment/import-bookings`, formData);
  // }

  public importBookings(data: any): Observable<any> {
    return this.http.post(`${uploaddelivery}`, data)
  }
}
