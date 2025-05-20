import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReportService } from '../report.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
  onSearchForm : FormGroup
  data: any = []
  constructor(private ngxLoader: NgxUiLoaderService, private router: Router, private service: ReportService, private fb:FormBuilder) {
    this.onSearchForm = this.fb.group({
      trackingNumber: 'ER12345',
      forwardingNumber : ''
    })
   }

  ngOnInit(): void {
    // this.getData();
  }
  displayNull: boolean = false


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

  onSubmit(){
    console.log(this.onSearchForm.value)
    this.service.saveSearch(this.onSearchForm.value).subscribe((res:any)=>{
      console.log(res)
      this.data = res.data[0];
      console.log(this.data)
      if (this.data) {
        this.displayNull = true
      } else {
        this.displayNull = false
      }
    })
  }

  printPage() {
    window.print();
  }
  

}






