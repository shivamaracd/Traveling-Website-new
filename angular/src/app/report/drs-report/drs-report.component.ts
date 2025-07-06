import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShipmentService } from 'src/app/shipment/shipment.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ClientService } from 'src/app/client/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drs-report',
  templateUrl: './drs-report.component.html',
  styleUrls: ['./drs-report.component.scss']
})
export class DrsReportComponent implements OnInit {
  public data: any = []
  public trackingOptions: any = []
  public startDate: string = '';
  public endDate: string = '';
  public quickTimeFilter: any = ''
  public predefinedRange: string = '';
  public clientData: any[] = []
  public isPrint: boolean = false;
  public deliveryBoyName: string = '';
  private runSheetCounter: number = 1;

  // Properties for DRS Report
  runSheetNo: string = 'RS20250701001';
  currentDate: Date = new Date();
  drsData: any[] = [];

  constructor(public __service: ReportService, private ngxLoader: NgxUiLoaderService, private shipment: ShipmentService, private __clintService: ClientService, private router: Router) { }

  ngOnInit(): void {
    console.log('Current route:', this.router.url);
    if (this.router.url === '/report/mis-report-print') {
      this.isPrint = true;
    }
    this.startDate = new Date().toISOString().split('T')[0];
    this.endDate = new Date().toISOString().split('T')[0];
    this.quickTimeFilter = ''
    this.getSepment();
    this.getClient();
    this.loadClientData();
  }

  getSepment() {
    this.shipment.getService().subscribe(res => {
      console.log(res)
      this.trackingOptions = res
    })
  }

  getClient() {
    this.__clintService.getService().subscribe(res => {
      console.log(res)
      this.clientData = res
    })
  }

  getDataDRSReport(data: any) {
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

  onDateChange() {
    console.log('Start:', this.startDate, 'End:', this.endDate);
    // Add your data filtering logic here
    let data = { start: this.startDate, end: this.endDate }
    this.__service.getFilterDRSdata(data).subscribe((res: any) => {
      console.log(res)
      // $('#summary3').DataTable().clear();
      // $('#summary3').DataTable().destroy();
      this.data = res.data;
      // $.getScript('/assets/table/table.js');
    }, err => {
      console.log(err)
      // $('#summary3').DataTable().destroy();
      // $('#summary3').DataTable().clear();
      // $.getScript('/assets/table/table.js');
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

  printReceipt() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let allReceiptsContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Delivery Run Sheet</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .header-left {
          flex: 1;
          line-height: 1.5;
        }
        .header-left img {
          max-width: 100px;
          height: auto;
        }
        .header-center {
          flex: 1;
          text-align: center;
          margin-top: 20px;
        }
        .header-right {
          flex: 1;
          text-align: right;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        table, th, td {
          border: 1px solid #000;
        }
        th, td {
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        th {
          background-color: #f0f0f0;
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-left">
          <img src="${window.location.origin}/assets/images/image/logo.png" alt="RV Courier and Logistics"><br>
          <strong>RV Courier and Logistics</strong><br>
          <!-- Add your company address here -->
        </div>
        <div class="header-center">
          <h2>Delivery Run Sheet</h2>
          <p><strong>Run Sheet No: </strong>${this.runSheetNo || this.getCurrentRunSheetNo()}</p>
        </div>
        <div class="header-right">
          <p><strong>Date: </strong>${new Date().toLocaleDateString()}</p>
          <p><strong>Delivery Boy Name: </strong>${this.deliveryBoyName || 'N/A'}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Consignee Details</th>
            <th>Tracking No.</th>
            <th>Type</th>
            <th>Forwarding By</th>
            <th>Forwarding No.</th>
            <th>Receiver Sign</th>
            <th>Receiver Mob No.</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${(this.data && this.data.length > 0)
            ? this.data.map((item: any, i: number) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.consignor_name || ''}</td>
                  <td>${item.tracking_no || ''}</td>
                  <td>${item.type || ''}</td>
                  <td>${item.forwarding_by || ''}</td>
                  <td>${item.forwarding_number || ''}</td>
                  <td style="min-height: 30px;"></td>
                  <td></td>
                  <td></td>
                </tr>
              `).join('')
            : `<tr><td colspan="9" style="text-align: center;">No data available</td></tr>`
          }
        </tbody>
      </table>

      <div style="margin-top: 50px;">
        <div style="float: left; width: 50%;">
          <p>Prepared By: _________________</p>
        </div>
        <div style="float: right; width: 50%; text-align: right;">
          <p>Authorized Signature: _________________</p>
        </div>
      </div>

    </body>
    </html>
    `;

    printWindow.document.write(allReceiptsContent);
    printWindow.document.close();

    // Wait for images to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getCurrentRunSheetNo(): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    return `RS${dateStr}${this.runSheetCounter.toString().padStart(3, '0')}`;
  }

  printDeliveryRunSheet() {
    // Store the original body classes
    const originalBodyClasses = document.body.className;

    // Add print-specific class to body
    document.body.classList.add('printing-delivery-sheet');

    // Get the print section
    const printContent = document.getElementById('printSection');
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Write the content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Delivery Run Sheet</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-left {
      line-height: 1.5;
    }
    .header-center {
      text-align: center;
      margin-top: 20px;
    }
    .header-right {
      text-align: right;
      line-height: 1.5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
    }
    table, th, td {
      border: 1px solid #000;
    }
    th, td {
      padding: 10px;
      text-align: center;
    }
    th {
      background-color: #f0f0f0;
    }
    .underline {
      border-bottom: 1px solid #000;
      display: inline-block;
      min-width: 200px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <strong>Logo RV Courier and Logistics</strong><br>
      Address and Details<br>
      Email Id and website
    </div>
    <div class="header-right">
      <strong>Date:-</strong><br><br>
      <strong>Delivery Boy Name:-</strong>
    </div>
  </div>

  <div class="header-center">
    <h2><u>Delivery Run Sheet</u></h2>
    <strong>Run Sheet No:-</strong>
  </div>

  <table>
    <thead>
      <tr>
        <th>Sr. No.</th>
        <th>Consignee Details</th>
        <th>Tracking No.</th>
        <th>Type</th>
        <th>Forwarding By</th>
        <th>Forwarding No.</th>
        <th>Receiver Sign</th>
        <th>Receiver Mob No.</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Ravi Kumar</td>
        <td>2100025</td>
        <td>Document</td>
        <td>Bluedart</td>
        <td>124361153164</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>

</body>
</html>

    `);

    // Wait for images to load
    printWindow.document.close();

    // Print after images are loaded
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        // Restore original body classes
        document.body.className = originalBodyClasses;
      };
    };
  }

  private loadClientData(): void {
    // Implementation to load client data
  }
}

