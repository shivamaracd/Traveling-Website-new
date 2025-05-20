import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.scss']
})
export class CourtComponent implements OnInit {

  public data: any[] = [];
  public closeResult = ''
  public caseCourtForm!: FormGroup
  public id: any
  public title : any = "Add Court"
  public btn : any = "Save"

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: SettingService) {
    this.caseCourtForm = this.fb.group({
      court: [''],
    });
  }

  ngOnInit(): void {
    this.getData()
  }

  public getData() {
    this.service.getService("court").subscribe(res => {
      $('#myTable8').DataTable().clear();
      $('#myTable8').DataTable().destroy();
      console.log("data get", res)
      $.getScript('/assets/table/table.js');
      this.data = res
    }, err => {
      $('#myTable8').DataTable().clear();
      $('#myTable8').DataTable().destroy();
      console.log("data get", err)
      $.getScript('/assets/table/table.js');
      this.data = []
    })
  }

  public onEdit(id: any) {
    this.title = "Update Court"
    this.btn = "Update"
    console.log("edit")
    this.id = id
    this.service.getService("court").subscribe(res => {
      let sdada: any = res.filter(item => {
        return item.id === this.id; 
      });
      if (sdada.length > 0) {
        this.caseCourtForm.patchValue({
          court: sdada[0].court,
        });
      } else {
        console.log("No matching data found");
      }
    });
  }

  public onDelete(id: any) {
    console.log("delete")
    if (!confirm('Are you sure, you want to delete this Court!')) {
      return;
    }
    if (id) {
      this.service.deleteService(id,"court").subscribe(res => {
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
    console.log(this.caseCourtForm.value)
    if (this.id > 0) {
      console.log(this.id, this.caseCourtForm.value)
      let data: any = { form: this.caseCourtForm.value, id: this.id }
      this.service.updateCourt(data).subscribe(res => {
        console.log("update", res)
        document.getElementById("cancelmodalsa")?.click();
        this.getData()
        this.close()
        this.id = 0
      })
    } else {
      this.service.saveService(this.caseCourtForm.value,"court").subscribe(res => {
        console.log("submit", res)
        document.getElementById("cancelmodalsa")?.click()
        this.getData()
        this.close()
      })
    }
  }


  close() {
    this.caseCourtForm.reset()
    this.title = "Add Court"
    this.btn = "Save"
    this.id = 0
  }

}
