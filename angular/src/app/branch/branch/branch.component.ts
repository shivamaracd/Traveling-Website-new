import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BranchService } from '../branch.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  data : any [] = []
  constructor(private ngxLoader: NgxUiLoaderService,private router:Router, private service:BranchService) { }

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
    this.router.navigate(['branch/add-branch']);
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
    this.router.navigate(['/branch/edit/' + id]);
  }


}

