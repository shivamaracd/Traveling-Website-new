import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingService } from '../setting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cash-type',
  templateUrl: './cash-type.component.html',
  styleUrls: ['./cash-type.component.scss']
})
export class CashTypeComponent implements OnInit {
  public data : any [] =[];
  public closeResult = ''
  public cashStatusForm!: FormGroup
  public id: any

  constructor(private modalService: NgbModal, private fb: FormBuilder, private service: SettingService) {
    this.cashStatusForm = this.fb.group({
      cash_type: [''],
      cash_sub_type: [''],
    });
  }

  ngOnInit(): void {
    this.getData()
  }

  public getData() {
    this.service.getService("caseType").subscribe(res => {
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
    console.log("edit")
    this.id = id
    this.service.editValue(id).subscribe(res => {
      console.log("edit value", res)
      this.cashStatusForm.patchValue({
        cash_type: res.data[0].cash_type,
        cash_sub_type: res.data[0].cash_sub_type,
      })
    })
  }

  public onDelete(id: any) {
    console.log("delete")
    if (!confirm('Are you sure, you want to delete this Case Status!')) {
      return;
    }
    if (id) {
      this.service.deleteService(id,"caseType").subscribe(res => {
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
    console.log(this.cashStatusForm.value)
    if (this.id > 0) {
      console.log(this.id, this.cashStatusForm.value)
      let data: any = { form: this.cashStatusForm.value, id: this.id }
      this.service.updateCashstatus(data).subscribe(res => {
        console.log("update", res)
        document.getElementById("cancelmodalsa")?.click();
        this.getData()
      })
    } else {
      this.service.saveService(this.cashStatusForm.value,"caseType").subscribe(res => {
        console.log("submit", res)
        document.getElementById("cancelmodalsa")?.click()
        this.getData()
      })
    }
  }


  close() {

  }

}
