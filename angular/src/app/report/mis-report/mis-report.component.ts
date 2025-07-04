import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ShipmentService } from 'src/app/shipment/shipment.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ClientService } from 'src/app/client/client.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mis-report',
  templateUrl: './mis-report.component.html',
  styleUrls: ['./mis-report.component.scss']
})
export class MisReportComponent implements OnInit {
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

  onDateChange() {
    console.log('Start:', this.startDate, 'End:', this.endDate);
    // Add your data filtering logic here
    let data = { start: this.startDate, end: this.endDate }
    this.__service.getFilterMISdata(data).subscribe((res: any) => {
      console.log(res)
      $('#summary3').DataTable().clear();
      $('#summary3').DataTable().destroy();
      this.data = res.data;
      $.getScript('/assets/table/table.js');
    }, err => {
      console.log(err)
      $('#summary3').DataTable().destroy();
      $('#summary3').DataTable().clear();
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

  printReceipt() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let allReceiptsContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>RV Courier Receipts</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { border: 2px solid #000080; display: flex; width: 100%; margin-bottom: 20px; page-break-after: always; }
        .left { width: 70%; border-right: 2px solid #000080; padding: 0px; }
        .right { width: 30%; padding: 0px; }
        .row { display: flex; border-bottom: 1px solid #000; }
        .cell { flex: 1; padding: 8px; border-right: 1px solid #000; }
        .cell:last-child { border-right: none; }
        .section-title { font-weight: bold; margin-top: 10px; margin-bottom: 5px; }
        .blue-banner { background: #223A7B; color: #fff; padding: 8px; font-weight: bold; text-align: center; margin-top: 10px; }
        @media print {
          .container { page-break-after: always; }
          .container:last-child { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>`;

    // Loop through each item in the data array
    this.data.forEach((item: any) => {
      allReceiptsContent += `
      <div class="container">
        <!-- Left 70% -->
        <div class="left">
          <div style="width: 100%; display: flex; border: 1px solid #000; font-family: Arial, sans-serif; font-size: 14px;">
            <!-- Left Side (50%) -->
            <div style="width: 50%; border-right: 1px solid #000; padding: 10px;">
              <!-- Header Section -->
              <div style="display: flex; align-items: center; border-bottom: 1px solid #000; padding-bottom: 10px;">
                <img src="../../../assets/images/image/logo.png" alt="Logo" style="width: 96px; height: 54px; margin-right: 10px;">
                <div style="flex: 1;">
                  <div style="font-size: 20px; font-weight: bold;">RV COURIER & LOGISTICS</div>
                  <div style="font-size: 12px;">
                    Office No. 301/1, Sec-17, Khandasa Dhani, Gurugram, Haryana 122006<br>
                    <strong>Domestic & International</strong> | <strong>Contact us: +91 9654162328</strong><br>
                    GSTIN: 06A********B1ZT &nbsp; | &nbsp;
                    <a href="https://www.rvcourierlogistics.com"
                      style="text-decoration: none; color: black;">www.rvcourierlogistics.com</a>
                  </div>
                </div>
              </div>

              <!-- Consigner Details -->
              <div style="border-bottom: 1px solid #000; padding: 10px 0; height: 130px;">
                <strong>Consigner Details:</strong>
                  <br>
                  <br>&nbsp;&nbsp;
                    ${item.client || ''}<br>
              </div>

              <!-- Mode & Weight Section -->
              <div style="display: flex; border-top: 1px solid #000; border-bottom: 1px solid #000; height: 70px;">
                <div style="flex: 3; display: flex; align-items: center; border-right: 1px solid #000;">
                  <div style="padding: 10px;">
                    <strong>Mode(✓)</strong> &nbsp;
                    <label style="margin-right: 15px;">Surface <input type="checkbox" ${item.mode === 'Surface' ? 'checked' : ''}></label>
                    <label style="margin-right: 15px;">Air Cargo <input type="checkbox" ${item.mode === 'Air Cargo' ? 'checked' : ''}></label>
                    <label>Express <input type="checkbox" ${item.mode === 'Express' ? 'checked' : ''}></label>
                  </div>
                </div>
                <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
                  <strong>Weight - ${item.weight || ''}Kg</strong><br>
                </div>
              </div>
            </div>

            <!-- Right Side (50%) -->
            <div style="width: 50%; padding: 10px;">
              <div style="display: flex; border-bottom: 1px solid #000; padding: 12px;">
                <div style="width: 50%; text-align: center; padding: 5px; border-right: 1px solid #000;">
                  <strong>AWB No.</strong>
                  <br>
                      ${item.tracking_number || ''}
                </div>
                <div style="width: 50%; padding: 5px; text-align: center;">
                  <strong>Destination</strong>
                  <br>
                      ${item.destination || ''}
                </div>
              </div>

              <!-- Consignee Details -->
              <div style="padding: 10px; height: 105px;">
                <strong>Consignee Details:</strong>
                <br>
                    ${item.consignor_name || ''},
                    ${item.company_name || ''},
                    ${item.consignee_address || ''}, ${item.state || ''},
                    ${item.country || ''} - ${item.pin_code || ''}<br>
                    Phone: ${item.consignee_mobile_number || ''}<br>
                    Email: ${item.email_id || ''}
              </div>

              <!-- Mobile Number -->
              <div style="padding: 10px; border-bottom: 1px solid #000;">
                <strong>Mobile No.</strong>
                ${item.consignee_mobile_number || ''}
              </div>

              <!-- Amount and Signature -->
              <div style="display: flex; border-bottom: 1px solid #000;">
                <div style="width: 30%; padding: 10px; border-right: 1px solid #000;">
                  <strong>Amount</strong>
                   ${item.amount || ''}
                </div>
                <div style="width: 70%; padding: 10px; text-align: center;">
                  <strong>Sender's Signature & Seal</strong>
                  <div style="padding: 10px; font-size: 12px;">
                    I have read and understood terms & Conditions printed overleaf of this consignment note I agree to the
                    same.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Blue Heading -->
          <div style="background-color: #1e2a91; color: white; text-align: center; padding: 10px; font-size: 20px; font-weight: bold;">
            FOR YOUR PERSONAL AND VALUABLE ITEMS, USE OUR EXPRESS SERVICE
          </div>

          <div style="font-family: Arial, sans-serif; font-size: 14px;">
            <!-- Terms and Conditions and Company Details -->
            <div style="display: flex; border-bottom: 1px solid #000;">
              <!-- Left Section -->
              <div style="flex: 3; padding: 10px; border-right: 1px solid #000; text-align: center;">
                <strong>Terms & Conditions:</strong><br>
                I/We declare that this consignment does't contain contraband, illegal drugs, any
                prohibited items and commodities which can cause safety hazards while transporting.

                <div style="padding: 10px; text-align: center; width: 100%; border-top: 1px solid #000;">
                  <span style="font-weight: bold;">📞 Customer Care No. +91 9654162328</span>
                </div>
              </div>

              <!-- Right Section -->
              <div style="flex: 1; padding: 10px;">
                <div style="text-align: right;">
                  <strong>For: RV COURIER & LOGISTICS</strong><br><br>
                  5600123
                  Authorised Sign.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 30% -->
        <div class="right">
          <div style="display:flex; width:100%; height:100%;">
            <!-- Left: 70% form section -->
            <div style="width:70%; padding:0px; border:1px solid #ccc;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <th colspan="2" style="border:1px solid #000; padding:35px; text-align:center; background-color:#ffffff;">
                    Date - ${item.booking_date ? new Date(item.booking_date).toLocaleDateString() : ''}</th>
                </tr>
                <tr>
                  <td colspan="2" style="border:1px solid #000; padding:20px;">&nbsp; ${item.tracking_number || ''}</td>
                </tr>
                <tr>
                  <th style="border:1px solid #000; padding:8px; background-color:#ffffff; font-size: 14px;">ORIGIN</th>
                  <th style="border:1px solid #000; padding:8px; background-color:#ffffff; font-size: 14px;">DESTINATION</th>
                </tr>
                <tr>
                  <td style="border:1px solid #000; padding:20px;">&nbsp; ${item.origin_city || ''}</td>
                  <td style="border:1px solid #000; padding:20px;">&nbsp; ${item.manifest_destination || ''}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">Type</td>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">Pcs</td>
                </tr>
                <tr>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">WEIGHT</td>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; ${item.weight || ''}Kg</td>
                </tr>
                <tr>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">COURIER CHARGES</td>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; ${item.courier_charges || ''}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">GST</td>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; ${item.gst || ''}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">TOTAL</td>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; ${item.total || ''}</td>
                </tr>
                <tr>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">CASH</td>
                  <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; ${item.payment_mode || ''}</td>
                </tr>
              </table>
            </div>

            <!-- Right: 30% blue section -->
            <div style="width:30%; background-color:#1e2a91;"></div>
          </div>
        </div>
      </div>`;
    });

    allReceiptsContent += `
    </body>
    </html>`;

    printWindow.document.write(allReceiptsContent);
    printWindow.document.close();

    // Wait for images to load before printing
    // setTimeout(() => {
    //   printWindow.print();
    //   printWindow.close();
    // }, 250);
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
}
