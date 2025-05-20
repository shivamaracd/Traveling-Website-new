import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingService } from '../setting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {

  public data: any[] = [];
  public closeResult = ''
  public taxForm!: FormGroup
  public id: any
  public title : any = "Add Cash Status"
  public btn : any = "Save"

  constructor(private router:Router,private modalService: NgbModal, private fb: FormBuilder, private service: SettingService) {
    this.taxForm = this.fb.group({
      case_status: [''],
    });
  }

  ngOnInit(): void {
    this.getData()
  }

  public getData() {
    this.service.getService("tax").subscribe(res => {
      $('#exectiveagent').DataTable().clear();
      $('#exectiveagent').DataTable().destroy();
      console.log("data get", res)
      $.getScript('/assets/table/table.js');
      this.data = res
    }, err => {
      $('#exectiveagent').DataTable().clear();
      $('#exectiveagent').DataTable().destroy();
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
    this.service.getService("tax").subscribe(res => {
      let sdada: any = res.filter(item => {
        return item.id === this.id; 
      });
      if (sdada.length > 0) {
        this.taxForm.patchValue({
          first_name: sdada[0].first_name,
          middle_name: sdada[0].middle_name,
          last_name: sdada[0].last_name,
          email: sdada[0].email,
          mobile_no: sdada[0].mobile_no,
          gender: sdada[0].gender,
          address: sdada[0].address,
          annual_income: sdada[0].annual_income,
          taxable_income: sdada[0].taxable_income,
          tax_due: sdada[0].tax_due
        });
      } else {
        console.log("No matching data found");
      }
    });
  }

  public onDelete(id: any) {
    console.log("delete")
    if (!confirm('Are you sure, you want to delete this Tax!')) {
      return;
    }
    if (id) {
      this.service.deleteService(id,"tax").subscribe(res => {
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

  openDialog() {
    this.router.navigate(['setting/add-tax']);
    // // this.submitted = false;
    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    //   (result) => {
    //     this.closeResult = `Closed with: ${result}`;
    //   });
  }

  public onsubmit() {
    console.log(this.taxForm.value)
    if (this.id > 0) {
      console.log(this.id, this.taxForm.value)
      let data: any = { form: this.taxForm.value, id: this.id }
      this.service.updateStatus(data).subscribe(res => {
        console.log("update", res)
        document.getElementById("cancelmodalsa")?.click();
        this.getData()
        this.close()
        this.id = 0

      })
    } else {
      this.service.saveService(this.taxForm.value,"caseStatus").subscribe(res => {
        console.log("submit", res)
        document.getElementById("cancelmodalsa")?.click()
        this.getData()
        this.close()
      })
    }
  }


  close() {
    this.taxForm.reset()
    this.title = "Add Case Status"
    this.btn = "Save"
    this.id = 0
  }

}
