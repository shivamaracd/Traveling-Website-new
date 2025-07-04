import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
  public onSearchForm: FormGroup;
  public data: any = {};
  public displayNull: boolean = false;

  constructor(
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private service: ReportService,
    private fb: FormBuilder
  ) {
    this.onSearchForm = this.fb.group({
      trackingNumber: '1234',
      forwardingNumber: ''
    });
  }

  ngOnInit(): void {
    // this.getData();
  }

  // getData() {
  //   this.service.getService().subscribe(res => {
  //     console.log("value", res)
  //     this.data = res[0];
  //     console.log(this.data)
  //     if (this.data) {
  //       this.displayNull = true
  //     } else {
  //       this.displayNull = false
  //     }
  //   }, err => {
  //     console.log("err")
  //   })
  // }

  onSubmit() {
    console.log(this.onSearchForm.value);
    this.service.saveSearch(this.onSearchForm.value).subscribe((res: any) => {
      console.log(res);
      this.data = res.data[0];
      console.log(this.data);
      if (this.data) {
        this.displayNull = true;
      } else {
        this.displayNull = false;
      }
    });
  }

  printReceipt() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>RV Courier Receipt</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { border: 2px solid #000080; display: flex; width: 100%; }
        .left { width: 70%; border-right: 2px solid #000080; padding: 0px; }
        .right { width: 30%; padding: 0px; }
        .row { display: flex; border-bottom: 1px solid #000; }
        .cell { flex: 1; padding: 8px; border-right: 1px solid #000; }
        .cell:last-child { border-right: none; }
        .section-title { font-weight: bold; margin-top: 10px; margin-bottom: 5px; }
        .blue-banner { background: #223A7B; color: #fff; padding: 8px; font-weight: bold; text-align: center; margin-top: 10px; }
      </style>
    </head>
    <body>
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
                ${this.data.consignor_name || ''}<br>
          </div>

          <!-- Mode & Weight Section -->
          <div style="display: flex; border-top: 1px solid #000; border-bottom: 1px solid #000; height: 70px;">
            <div style="flex: 3; display: flex; align-items: center; border-right: 1px solid #000;">
              <div style="padding: 10px;">
                <strong>Mode(✓)</strong> &nbsp;
                <label style="margin-right: 15px;">Surface <input type="checkbox" ></label>
                <label style="margin-right: 15px;">Air Cargo <input type="checkbox"></label>
                <label>Express <input type="checkbox"></label>
              </div>
            </div>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
              <strong>Weight - ${this.data.volumetric_weight || ''  }Kg</strong><br>
            </div>
          </div>
        </div>

        <!-- Right Side (50%) -->
        <div style="width: 50%; padding: 10px;">
          <div style="display: flex; border-bottom: 1px solid #000; padding: 12px;">
            <div style="width: 50%; text-align: center; padding: 5px; border-right: 1px solid #000;">
              <strong>AWB No.</strong>
              <br>
                  ${this.data.tracking_number || ''}
            </div>
            <div style="width: 50%; padding: 5px; text-align: center;">
              <strong>Destination</strong>
              <br>
                  ${this.data.manifest_destination || ''}
            </div>
          </div>

          <!-- Consignee Details -->
          <div style="padding: 10px; height: 105px;">
            <strong>Consignee Details:</strong>
            <br>
                ${this.data.consignor_name || ''},
                ${this.data.company_name || ''},
                ${this.data.origin_city || ''}, ${this.data.state || ''},
                ${this.data.country || ''} - ${this.data.pin_code || ''}<br>
                Phone: ${this.data.mobile_no || ''}<br>
                Email: ${this.data.email_id || ''}
          </div>

          <!-- Mobile Number -->
          <div style="padding: 10px; border-bottom: 1px solid #000;">
            <strong>Mobile No.</strong>
            ${this.data.mobile_no || ''  }
          </div>

          <!-- Amount and Signature -->
          <div style="display: flex; border-bottom: 1px solid #000;">
            <div style="width: 30%; padding: 10px; border-right: 1px solid #000;">
              <strong>Amount</strong>
               ---------
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
      <div
        style="background-color: #1e2a91; color: white; text-align: center; padding: 10px; font-size: 20px; font-weight: bold;">
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
              ${this.data.po_no || ''  }
              Authorised Sign.
            </div>
          </div>
        </div>

        <!-- Customer Care -->
        <!-- <div style="padding: 10px; text-align: center; width: 74%;">
    <span style="font-weight: bold;">📞 Customer Care No. +91 9654162328</span>
</div> -->

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
                Date - ${this.data.booking_date ? new Date(this.data.booking_date).toLocaleDateString() : ''}</th>
            </tr>
            <tr>
              <td colspan="2" style="border:1px solid #000; padding:20px;">&nbsp; ${this.data.ref_no || ''  }</td>
            </tr>
            <tr>
              <th style="border:1px solid #000; padding:8px; background-color:#ffffff; font-size: 14px;">ORIGIN</th>
              <th style="border:1px solid #000; padding:8px; background-color:#ffffff; font-size: 14px;">DESTINATION
              </th>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:20px;">&nbsp; ${this.data.origin || ''  }</td>
              <td style="border:1px solid #000; padding:20px;">&nbsp; ${this.data.destination || ''  }</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">Type</td>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">Pcs</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">WEIGHT</td>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; ${this.data.volumetric_weight || ''  }Kg</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">COURIER CHARGES</td>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; 20</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">TOTAL</td>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; -------</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">CASH</td>
              <td style="border:1px solid #000; padding:8px; font-size: 10px; font-weight: 600;">&nbsp; NA</td>
            </tr>
          </table>
        </div>

        <!-- Right: 30% blue section -->
        <div style="width:30%; background-color:#1e2a91;"></div>

      </div>
    </div>
  </div>
    </body>
    </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();

    // Wait for images to load before printing
    // setTimeout(() => {
    //   printWindow.print();
    //   printWindow.close();
    // }, 250);
  }

  printPage() {
    window.print();
  }

  downloadPDF() {
    const receiptElement = document.getElementById('receipt');
    if (receiptElement) {
      html2canvas(receiptElement, {
        scale: 2,
        logging: false,
        useCORS: true
      }).then(canvas => {
        const imgWidth = 208; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`RV_Courier_Receipt_${this.data.tracking_number}.pdf`);
      });
    }
  }
}






