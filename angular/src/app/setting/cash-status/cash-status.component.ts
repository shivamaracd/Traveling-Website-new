import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-cash-status',
  templateUrl: './cash-status.component.html',
  styleUrls: ['./cash-status.component.scss']
})
export class CashStatusComponent implements OnInit {
  public data: any[] = [];
  public closeResult = ''
  public caseStatusForm!: FormGroup
  public id: any
  public title : any = "Add Cash Status"
  public btn : any = "Save"

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: SettingService) {
    this.caseStatusForm = this.fb.group({
      case_status: [''],
    });
  }

  ngOnInit(): void {
    this.getData()
  }

  public getData() {
    this.service.getService("caseStatus").subscribe(res => {
      $('#myTable4').DataTable().clear();
      $('#myTable4').DataTable().destroy();
      console.log("data get", res)
      $.getScript('/assets/table/table.js');
      this.data = res
    }, err => {
      $('#myTable4').DataTable().clear();
      $('#myTable4').DataTable().destroy();
      console.log("data get", err)
      $.getScript('/assets/table/table.js');
      this.data = []
    })
  }

  public onEdit(id: any) {
    this.title = "Update Case Status"
    this.btn = "Update"
    console.log("edit")
    this.id = id
    this.service.getService("caseStatus").subscribe(res => {
      let sdada: any = res.filter(item => {
        return item.id === this.id; 
      });
      if (sdada.length > 0) {
        this.caseStatusForm.patchValue({
          case_status: sdada[0].case_status,
        });
      } else {
        console.log("No matching data found");
      }
    });
  }

  public onDelete(id: any) {
    console.log("delete")
    if (!confirm('Are you sure, you want to delete this Case Status!')) {
      return;
    }
    if (id) {
      this.service.deleteService(id,"caseStatus").subscribe(res => {
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
    console.log(this.caseStatusForm.value)
    if (this.id > 0) {
      console.log(this.id, this.caseStatusForm.value)
      let data: any = { form: this.caseStatusForm.value, id: this.id }
      this.service.updateStatus(data).subscribe(res => {
        console.log("update", res)
        document.getElementById("cancelmodalsa")?.click();
        this.getData()
        this.close()
        this.id = 0

      })
    } else {
      this.service.saveService(this.caseStatusForm.value,"caseStatus").subscribe(res => {
        console.log("submit", res)
        document.getElementById("cancelmodalsa")?.click()
        this.getData()
        this.close()
      })
    }
  }


  close() {
    this.caseStatusForm.reset()
    this.title = "Add Case Status"
    this.btn = "Save"
    this.id = 0
  }


}
