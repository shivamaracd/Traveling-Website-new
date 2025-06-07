import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-print-receipt',
  templateUrl: './print-receipt.component.html',
  styleUrls: ['./print-receipt.component.scss']
})
export class PrintReceiptComponent implements OnInit {
  receiptData: any = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const trackingNumber = params['tracking_number'];
      if (trackingNumber) {
        this.loadReceiptData(trackingNumber);
      }
    });
  }

  loadReceiptData(trackingNumber: string) {
    this.reportService.getDataMISReport(trackingNumber).subscribe(
      (response: any) => {
        if (response.data && response.data.length > 0) {
          this.receiptData = response.data[0];
          this.loading = false;
          // Wait for the data to be rendered before printing
          setTimeout(() => {
            window.print();
          }, 1000);
        }
      },
      error => {
        console.error('Error loading receipt data:', error);
        this.loading = false;
      }
    );
  }
}
