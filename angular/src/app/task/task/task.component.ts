import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(private ngxLoader: NgxUiLoaderService,private router:Router , private service:TaskService) { }

  ngOnInit(): void {
    this.getTask();
  }

  public taskValue: any = []
  getTask(){
    this.ngxLoader.start();

    this.service.getService().subscribe(res=>{
      $('#myTable1').DataTable().clear();
      $('#myTable1').DataTable().destroy();
      console.log("this task data",res)
      this.taskValue = res
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
  onDelete(id:any){
    if (!confirm('Are you sure, you want to delete this Task!')) {
      return ;
    }
    if (id) {
      this.service.deleteService(id).subscribe(res => {
        if (res.error == 0) {
          alert(res.message)
          this.getTask();
        } else {
          alert(res.message)
          this.getTask();
        }
      }, error => {
        console.log(error)
      })
    }
  }
  onEdit(id:any){
    this.router.navigate(['task/add']);
  }

  openClientModal() {
    // this.modalService.open(contentgroup);
    this.router.navigate(['task/add + id']);
  }

}
