import { Component, OnInit } from '@angular/core';
import { DeliveryService } from 'src/app/delivery/delivery.service';
import { ManifestService } from 'src/app/manifest/manifest.service';
import { ShipmentService } from 'src/app/shipment/shipment.service';
import { VanderService } from 'src/app/vander/vander.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  bookingCount: any = []
  deliveryCount: any = []
  manifestCount: any = []
  vanderCount: any = []
  deliveryStatus: any = []
  constructor(private __bookService: ShipmentService, private __deliveryService: DeliveryService, private __manifestService: ManifestService, private __vanderService: VanderService) { }

  ngOnInit(): void {
    this.__bookService.getService().subscribe(res => {
      console.log("booking count", res.length)
      this.bookingCount = res.length
    })

    this.__deliveryService.getDeliveryData().subscribe(res => {
      console.log("delivery count", res.data.length)
      this.deliveryCount = res.data.length
    })

    this.__manifestService.getService().subscribe(res => {
      console.log("delivery count", res.length)
      this.manifestCount = res.length
    })

    this.__vanderService.getService().subscribe(res => {
      console.log("delivery count", res.length)
      this.vanderCount = res.length
    })

    this.__deliveryService.getDeliveryStatus().subscribe(res => {
      console.log("delivery status", res.data)
      this.deliveryStatus = res.data
    })

  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'delivered':
        return 'green';
      case 'rto':
        return 'red';
      case 'in-transit':
        return 'blue';
      case 'mis-route':
        return 'orange';
      default:
        return 'gray'; // fallback
    }
  }


}
