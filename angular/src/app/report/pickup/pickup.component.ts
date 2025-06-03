import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShipmentService } from 'src/app/shipment/shipment.service';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss']
})
export class PickupComponent implements OnInit {
  public data : any = []
  public trackingOptions : any = []
  constructor(public __service:ReportService, private ngxLoader: NgxUiLoaderService, private shipment: ShipmentService) { }

  ngOnInit(): void {
     this.getSepment();
  }

   getSepment() {
    this.shipment.getService().subscribe(res => {
      console.log(res)
      this.trackingOptions = res
    })
  }

  getDataPicupReport(data:any) {
    console.log(data.target.value)
    // this.ngxLoader.start();
    this.__service.getDataPicupReport(data.target.value).subscribe((res:any) => {
      console.log(res)
      $('#summary1').DataTable().clear();
      $('#summary1').DataTable().destroy();
      this.data = res.data;
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    }, (err:any ) => {
      $('#summary1').DataTable().destroy();
      $('#summary1').DataTable().clear();
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    })
  }


}

