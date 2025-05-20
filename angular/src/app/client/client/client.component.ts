import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  data : any [] = []
  constructor(private ngxLoader: NgxUiLoaderService,private router:Router, private service:ClientService) { }

  ngOnInit(): void {
   this.getData();
  }
  getData(){
    this.ngxLoader.start();
    this.service.getService().subscribe(res=>{
    $('#myTable1').DataTable().clear();
    $('#myTable1').DataTable().destroy();
    this.data = res;
    $.getScript('/assets/table/table.js');
    this.ngxLoader.stop();
  }, err => {
    console.log(err)
    $('#myTable1').DataTable().destroy();
    $('#myTable1').DataTable().clear();
    $.getScript('/assets/table/table.js');
    this.ngxLoader.stop();
  })
  }

  openClientModal() {
    // this.modalService.open(contentgroup);
    this.router.navigate(['client/add']);
  }

  onDelete(id:any){
    if (!confirm('Are you sure, you want to delete this Client!')) {
      return ;
    }
    if (id) {
      this.service.deleteService(id).subscribe(res => {
        if (res.error == 0) {
          alert(res.message)
          this.getData();
        } else {
          alert(res.message)
          this.getData();
        }
      }, error => {
        console.log(error)
      })
    }
  }
  onEdit(id : any){
    this.router.navigate(['/client/edit/' + id]);
  }


}
