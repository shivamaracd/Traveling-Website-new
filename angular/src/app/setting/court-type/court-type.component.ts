import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-court-type',
  templateUrl: './court-type.component.html',
  styleUrls: ['./court-type.component.scss']
})
export class CourtTypeComponent implements OnInit {

  public data : any [] =[];
  public closeResult = ''
  public courtTypeForm!: FormGroup
  public id: any

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: SettingService) {
    this.courtTypeForm = this.fb.group({
      court_type: [''],
    });
  }

  ngOnInit(): void {
    this.getData()
  }

  public getData() {
    this.service.getService("courtType").subscribe(res => {
      $('#myTable5').DataTable().clear();
      $('#myTable5').DataTable().destroy();
      console.log("data get", res)
      $.getScript('/assets/table/table.js');
      this.data = res
    }, err => {
      $('#myTable5').DataTable().clear();
      $('#myTable5').DataTable().destroy();
      console.log("data get", err)
      $.getScript('/assets/table/table.js');
      this.data = []
    })
  }

  public onEdit(id: any) {
    console.log("edit");
    this.id = id;
    this.service.getService("courtType").subscribe(res => {
      let sdada: any = res.filter(item => {
        return item.id === this.id; 
      });
      if (sdada.length > 0) {
        this.courtTypeForm.patchValue({
          court_type: sdada[0].court_type,
        });
      } else {
        console.log("No matching data found");
      }
    });
  }
  

  public onDelete(id: any) {
    console.log("delete")
    if (!confirm('Are you sure, you want to delete this Court Type!')) {
      return;
    }
    if (id) {
      this.service.deleteService(id,"courtType").subscribe(res => {
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

  openDialog(content: any) {
    // this.submitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      });
  }

  public onsubmit() {
    console.log(this.courtTypeForm.value)
    if (this.id > 0) {
      console.log(this.id, this.courtTypeForm.value)
      this.service.updateService(this.courtTypeForm.value, this.id, "courtType").subscribe(res => {
        console.log("update", res)
        document.getElementById("cancelmodalsa")?.click();
        this.getData();
        this.close();
      })
    } else {
      this.service.saveService(this.courtTypeForm.value,"courtType").subscribe(res => {
        console.log("submit", res)
        document.getElementById("cancelmodalsa")?.click();
        this.getData();
        this.close();
      })
    }
  }

  close(){
    this.courtTypeForm.reset();
  }

}
