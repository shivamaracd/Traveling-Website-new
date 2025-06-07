import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShipmentService } from 'src/app/shipment/shipment.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ClientService } from 'src/app/client/client.service';

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss']
})
export class PickupComponent implements OnInit {
  public data: any = []
  public trackingOptions: any = []

  startDate: string = '';
  endDate: string = '';
  public quickTimeFilter: any = ''
  predefinedRange: string = '';

  filteredData: any[] = [];
  clientData : any = []
  constructor(public __service: ReportService, private ngxLoader: NgxUiLoaderService, private shipment: ShipmentService, private __clientService:ClientService) { }

  ngOnInit(): void {
    this.startDate = new Date().toISOString().split('T')[0];
    this.endDate = new Date().toISOString().split('T')[0];
    this.quickTimeFilter = ''
    this.getSepment();
    this.getClient();
  }

  getClient(){
    this.__clientService.getService().subscribe(res=>{
      console.log(res)
      this.clientData = res
    })
  }

  getSepment() {
    this.shipment.getService().subscribe(res => {
      console.log(res)
      this.trackingOptions = res
    })
  }

  getDataPicupReport(data: any) {
    console.log(data.target.value)
    // this.ngxLoader.start();
    this.__service.getDataPicupReport(data.target.value).subscribe((res: any) => {
      console.log(res)
      $('#summary1').DataTable().clear();
      $('#summary1').DataTable().destroy();
      this.data = res.data;
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    }, (err: any) => {
      $('#summary1').DataTable().destroy();
      $('#summary1').DataTable().clear();
      $.getScript('/assets/table/table.js');
      // this.ngxLoader.stop();
    })
  }


  onDateChange() {
    console.log('Start:', this.startDate, 'End:', this.endDate);
    // Add your data filtering logic here
    let data = { start: this.startDate, end: this.endDate }
    this.__service.getFilterPicupdata(data).subscribe((res: any) => {
      console.log(res)
      $('#summary1').DataTable().clear();
      $('#summary1').DataTable().destroy();
      this.data = res.data;
      $.getScript('/assets/table/table.js');
    }, err => {
      console.log(err)
      $('#summary1').DataTable().destroy();
      $('#summary1').DataTable().clear();
      $.getScript('/assets/table/table.js');
    })
  }

  onPredefinedRangeChange(event: any) {
    const today = new Date();
    let start: Date;
    let end: Date = new Date();

    switch (event.target.value) {
      case 'today':
        start = end = new Date();
        break;
      case 'yesterday':
        start = end = new Date(today.setDate(today.getDate() - 1));
        break;
      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(today.getFullYear(), quarterStart.getMonth() + 3, 0);
        start = quarterStart;
        end = quarterEnd;
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        return;
    }

    this.startDate = start.toISOString().split('T')[0];
    this.endDate = end.toISOString().split('T')[0];

    this.onDateChange();
  }


  exportToExcel(): void {
    // Replace this.dataToExport with your actual filtered data list (array of objects)
    const data = this.data || []; // filteredData is assumed to be your table data

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Status Report': worksheet },
      SheetNames: ['Status Report']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    FileSaver.saveAs(blob, `picup-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

}

