import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShipmentService } from 'src/app/shipment/shipment.service';
@Component({
  selector: 'app-mis-report',
  templateUrl: './mis-report.component.html',
  styleUrls: ['./mis-report.component.scss']
})
export class MisReportComponent implements OnInit {
  public data: any = []
  public trackingOptions: any = []
  constructor(public __service: ReportService, private ngxLoader: NgxUiLoaderService, private shipment: ShipmentService) { }

  ngOnInit(): void {
    this.getSepment();
  }

  getSepment() {
    this.shipment.getService().subscribe(res => {
      console.log(res)
      this.trackingOptions = res
    })
  }

  getDataMISReport(data: any) {
    console.log(data.target.value)
    // this.ngxLoader.start();
    this.__service.getDataMISReport(data.target.value).subscribe((res: any) => {
      console.log(res)
      $('#summary3').DataTable().clear();
      $('#summary3').DataTable().destroy();
      this.data = res.data;
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    }, (err: any) => {
      $('#summary3').DataTable().destroy();
      $('#summary3').DataTable().clear();
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    })
  }


}
