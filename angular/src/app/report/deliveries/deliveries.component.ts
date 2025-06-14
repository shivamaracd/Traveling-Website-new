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
  onSearchForm: FormGroup;
  data: any = [];
  displayNull: boolean = false;

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






