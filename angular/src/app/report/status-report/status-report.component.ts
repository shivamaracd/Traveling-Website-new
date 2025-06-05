import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShipmentService } from 'src/app/shipment/shipment.service';
@Component({
  selector: 'app-status-report',
  templateUrl: './status-report.component.html',
  styleUrls: ['./status-report.component.scss']
})
export class StatusReportComponent implements OnInit {
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
      $('#myTable4').DataTable().clear();
      $('#myTable4').DataTable().destroy();
      this.data = res.data;
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    }, (err: any) => {
      $('#myTable4').DataTable().destroy();
      $('#myTable4').DataTable().clear();
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    })
  }


}
