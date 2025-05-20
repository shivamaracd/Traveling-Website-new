import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DeliveryService } from '../delivery.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  data : any [] = []
  constructor(private ngxLoader: NgxUiLoaderService,private router:Router, private service:DeliveryService) { }

  ngOnInit(): void {
   this.getData();
  }
  getData(){
    this.ngxLoader.start();
    this.service.getService().subscribe(res=>{
      console.log(res)
    $('#myTable8').DataTable().clear();
    $('#myTable8').DataTable().destroy();
    this.data = res;
    $.getScript('/assets/table/table.js');
    this.ngxLoader.stop();
  }, err => {
    console.log(err)
    $('#myTable8').DataTable().destroy();
    $('#myTable8').DataTable().clear();
    $.getScript('/assets/table/table.js');
    this.ngxLoader.stop();
  })
  }

  openClientModal() {
    // this.modalService.open(contentgroup);
    this.router.navigate(['delivery/add']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'text-warning';   // yellow
      case 'Delivered':
        return 'text-success';   // green
      case 'Returned':
        return 'text-primary';   // blue
      default:
        return 'text-dark';      // default
    }
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



