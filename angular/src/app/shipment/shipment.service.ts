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
    // this.initializeSampleData();
  }

  // private initializeSampleData() {
  //   const sampleData = [
  //     {
  //       id: 1,
  //       tracking_number: 'TRK001',
  //       client: 'ABC Corporation',
  //       client_department: 'Logistics',
  //       order_date: '2024-03-01',
  //       destination_pincode: '400001',
  //       destinations: 'Mumbai',
  //       configurations_name: 'John Doe',
  //       configurations_address: '123 Business Park',
  //       configurations_address1: 'Floor 5',
  //       destination_landmark: 'Near Central Station',
  //       configurations_mobile_number: '9876543210',
  //       remark: 'Urgent Delivery',
  //       remark2: 'Handle with care',
  //       volumetric_weight: 10.5,
  //       weight: 8.2,
  //       height: 20,
  //       lenght: 30,
  //       width: 15,
  //       weight2: 8.5,
  //       shipping_cost: 1500
  //     },
  //     {
  //       id: 2,
  //       tracking_number: 'TRK002',
  //       client: 'XYZ Industries',
  //       client_department: 'Procurement',
  //       order_date: '2024-03-02',
  //       destination_pincode: '110001',
  //       destinations: 'Delhi',
  //       configurations_name: 'Jane Smith',
  //       configurations_address: '456 Industrial Area',
  //       configurations_address1: 'Building A',
  //       destination_landmark: 'Opposite Metro Station',
  //       configurations_mobile_number: '9876543211',
  //       remark: 'Standard Delivery',
  //       remark2: 'Fragile Items',
  //       volumetric_weight: 15.2,
  //       weight: 12.5,
  //       height: 25,
  //       lenght: 35,
  //       width: 20,
  //       weight2: 12.8,
  //       shipping_cost: 2000
  //     },
  //     {
  //       id: 3,
  //       tracking_number: 'TRK003',
  //       client: 'Global Trading Co.',
  //       client_department: 'Export',
  //       order_date: '2024-03-03',
  //       destination_pincode: '700001',
  //       destinations: 'Kolkata',
  //       configurations_name: 'Robert Brown',
  //       configurations_address: '789 Trade Center',
  //       configurations_address1: 'Suite 302',
  //       destination_landmark: 'Near Airport',
  //       configurations_mobile_number: '9876543212',
  //       remark: 'Express Delivery',
  //       remark2: 'Temperature Sensitive',
  //       volumetric_weight: 8.7,
  //       weight: 7.5,
  //       height: 18,
  //       lenght: 25,
  //       width: 12,
  //       weight2: 7.8,
  //       shipping_cost: 1800
  //     },
  //     {
  //       id: 4,
  //       tracking_number: 'TRK004',
  //       client: 'Tech Solutions Ltd',
  //       client_department: 'IT',
  //       order_date: '2024-03-04',
  //       destination_pincode: '560001',
  //       destinations: 'Bangalore',
  //       configurations_name: 'Sarah Johnson',
  //       configurations_address: '321 Tech Park',
  //       configurations_address1: 'Block C',
  //       destination_landmark: 'Near IT Hub',
  //       configurations_mobile_number: '9876543213',
  //       remark: 'Priority Delivery',
  //       remark2: 'Electronic Items',
  //       volumetric_weight: 12.3,
  //       weight: 10.2,
  //       height: 22,
  //       lenght: 28,
  //       width: 18,
  //       weight2: 10.5,
  //       shipping_cost: 2200
  //     },
  //     {
  //       id: 5,
  //       tracking_number: 'TRK005',
  //       client: 'Retail Chain Inc',
  //       client_department: 'Operations',
  //       order_date: '2024-03-05',
  //       destination_pincode: '380001',
  //       destinations: 'Ahmedabad',
  //       configurations_name: 'Michael Wilson',
  //       configurations_address: '654 Mall Road',
  //       configurations_address1: 'Shop No. 45',
  //       destination_landmark: 'Near City Center',
  //       configurations_mobile_number: '9876543214',
  //       remark: 'Regular Delivery',
  //       remark2: 'Retail Goods',
  //       volumetric_weight: 9.8,
  //       weight: 8.5,
  //       height: 19,
  //       lenght: 26,
  //       width: 14,
  //       weight2: 8.7,
  //       shipping_cost: 1600
  //     }
  //   ];

  //   // Store sample data in localStorage for demo purposes
  //   if (!localStorage.getItem('shipmentData')) {
  //     localStorage.setItem('shipmentData', JSON.stringify(sampleData));
  //   }
  // }

  // override saveService(data: any): Observable<any> {
  //   // For demo purposes, save to localStorage
  //   const existingData = JSON.parse(localStorage.getItem('shipmentData') || '[]');
  //   const newId = Math.max(...existingData.map((item: any) => item.id), 0) + 1;
  //   data.id = newId;
  //   existingData.push(data);
  //   localStorage.setItem('shipmentData', JSON.stringify(existingData));
  //   return new Observable(observer => {
  //     observer.next({ error: 0, message: 'Shipment saved successfully' });
  //     observer.complete();
  //   });
  // }

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
