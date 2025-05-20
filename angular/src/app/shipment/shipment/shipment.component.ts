import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ShipmentService} from '../shipment.service'
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss']
})
export class ShipmentComponent implements OnInit {
  data : any [] = []
  constructor(private ngxLoader: NgxUiLoaderService,private router:Router, private service:ShipmentService) { }

  ngOnInit(): void {
   this.getData();
  }
  getData(){
    this.ngxLoader.start();
    this.service.getService().subscribe(res=>{
      console.log(res)
    $('#campainPassbookTable').DataTable().clear();
    $('#campainPassbookTable').DataTable().destroy();
    this.data = res;
    $.getScript('/assets/table/table.js');
    this.ngxLoader.stop();
  }, err => {
    console.log(err)
    $('#campainPassbookTable').DataTable().destroy();
    $('#campainPassbookTable').DataTable().clear();
    $.getScript('/assets/table/table.js');
    this.ngxLoader.stop();
  })
  }

  openClientModal() {
    // this.modalService.open(contentgroup);
    this.router.navigate(['shipment/add']);
  }

  onDelete(id:any){
    if (!confirm('Are you sure, you want to delete this Client!')) {
      return ;
    }
    if (id) {
      this.service.deleteService(id).subscribe(res => {
        if (res.error == 0) {
          // alert(res.message)
          this.getData();
        } else {
          // alert(res.message)
          this.getData();
        }
      }, error => {
        console.log(error)
      })
    }
  }
  onEdit(id : any){
    this.router.navigate(['/shipment/edit/' + id]);
  }


}

