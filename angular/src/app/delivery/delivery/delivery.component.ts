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
  data: any[] = []
  hideTitle: boolean = false;
  trackingNumber: string = '';  
  constructor(private ngxLoader: NgxUiLoaderService, private router: Router, private service: DeliveryService) { }

  ngOnInit(): void {
    if(this.router.url == '/delivery/delivery-report'){
      this.hideTitle = true;
    }
    this.getData();
  }
  getData() {
    this.ngxLoader.start();
    this.service.getDeliveryData().subscribe(res => {
      console.log(res)
      $('#myTable8').DataTable().clear();
      $('#myTable8').DataTable().destroy();
      this.data = res.data;
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


  onDelete(id: any) {
    if (!confirm('Are you sure, you want to delete this Client!')) {
      return;
    }
    if (id) {
      this.service.deleteDelivery(id).subscribe(res => {
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
  onEdit(id: any) {
    this.router.navigate(['/shipment/edit/' + id]);
  }

  searchByTracking() {
    console.log(this.trackingNumber);
    let data = this.data.find((item: any) => item.tracking_number == this.trackingNumber);
    if(data){
      this.data = [data];
    }else{
      alert('Tracking Number not found');
    }
  }


}



