import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamMemberService } from '../team-member.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import 'datatables.net';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  allMember!: any[];
  dtOptions: any = {};
  public executivenameform: FormGroup;
  public dropdownSettings: IDropdownSettings = {
    idField: 'value',
    textField: 'label',
    enableCheckAll: true,
    allowSearchFilter: true,
    itemsShowLimit: 10,
  };

  roles = [
      { value: 1, label: 'admin | log enter | can add log enter' },
      { value: 2, label: 'admin | log enter | can change log enter' },
      { value: 3, label: 'admin | log enter | can delete log enter' },
      { value: 4, label: 'admin | log enter | can view log enter' },
      { value: 5, label: 'apps | client | can add client' },
      { value: 6, label: 'apps | client | can change client' },
      { value: 7, label: 'apps | client | can delete client' },
      { value: 8, label: 'apps | client | can view client' },
      { value: 9, label: 'apps | contact manager | can add contact manager' },
      { value: 10, label: 'apps | contact manager | can change contact manager' },
      { value: 11, label: 'apps | contact manager | can delete contact manager' },
      { value: 12, label: 'apps | contact manager | can view contact manager' },
      { value: 13, label: 'apps | delivery | can add delivery' },
      { value: 14, label: 'apps | delivery | can change delivery' },
      { value: 15, label: 'apps | delivery | can delete delivery' },
      { value: 16, label: 'apps | delivery | can view delivery' },
      { value: 17, label: 'apps | manifest | can add manifest' },
      { value: 18, label: 'apps | manifest | can change manifest' },
      { value: 19, label: 'apps | manifest | can delete manifest' },
      { value: 20, label: 'apps | manifest | can view manifest' },
      { value: 21, label: 'apps | shipment | can add shipment' },
      { value: 22, label: 'apps | shipment | can change shipment' },
      { value: 23, label: 'apps | shipment | can delete shipment' },
      { value: 24, label: 'apps | shipment | can view shipment' },
      { value: 25, label: 'auth | group | can add group' },
      { value: 26, label: 'auth | group | can change group' },
      { value: 27, label: 'auth | group | can delete group' },
      { value: 28, label: 'auth | group | can view group' },
      { value: 29, label: 'auth | permission | can add permission' },
      { value: 30, label: 'auth | permission | can change permission' },
      { value: 31, label: 'auth | permission | can delete permission' },
      { value: 32, label: 'auth | permission | can view permission' },
      { value: 33, label: 'auth | user | can add user' },
      { value: 34, label: 'auth | user | can change user' },
      { value: 35, label: 'auth | user | can delete user' },
      { value: 36, label: 'auth | user | can view user' },
    ];
  groupid: any;
  constructor(private modalService: NgbModal,private router:Router, private service: TeamMemberService, private toaster:NgToastService, private ngxLoader: NgxUiLoaderService, public fb: FormBuilder) {
    this.executivenameform = this.fb.group({
      role: ['']
    });
   }

  ngOnInit(): void {
    this.getMember()
  }

  navigateToAddMember() {
    this.router.navigate(['team/add']);
  }
  openexuctivename(item: any) {
    this.groupid = item.id;
    let exelist = JSON.parse(item.role)
    this.executivenameform.patchValue({
      role: exelist
    });
  }

  saveexuctive() {
    const selectedIds = this.executivenameform.value.role.map((item:any) => item.value);
    const selectedExecutives = this.roles.filter(executive => selectedIds.includes(executive.value)).map(({ value, label }) => ({ value, label }));
    console.log("Selected IDs:", selectedIds, selectedExecutives);
    // let totalcount = this.executivenameform.value.exuctivename.length;
    this.service.addexuctiveuser({ idgroup: this.groupid, mappedexe: selectedIds, newList: selectedExecutives }).subscribe(res => {
      document.getElementById("closebutton")?.click();
      this.toaster.success({detail:"Role Added Successfully!"}) 
      this.getMember();
    }, err=>{
      console.log(err)
    })
  }


  getMember() {
    this.ngxLoader.start();
    this.service.getService().subscribe(
      (res) => {
        $('#myTable2').DataTable().clear();
        $('#myTable2').DataTable().destroy();
        this.allMember = res;
        $.getScript('/assets/table/table.js');
        this.ngxLoader.stop();
      },
      (err) => {
        console.log(err);
        $('#myTable2').DataTable().destroy();
        $('#myTable2').DataTable().clear();
        $.getScript('/assets/table/table.js');
        this.ngxLoader.stop();
      }
    );
  }
  public closeResult = ''
  
  openDialog(content: any) {
    // this.submitted = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      });
  }

  deleteMember(id: number){
    if (!confirm('Are you sure, you want to delete this Member!')) {
      return ;
    }
    this.ngxLoader.start();
    this.service.deleteService(id).subscribe(res =>{
      console.log(res);
      this.getMember();
      this.toaster.success({detail:"User deleted successfully!"}) 
      this.ngxLoader.stop();
    }, err=>{
      console.log(err)
    })
  }

  onEdit(id : any){
    this.router.navigate(['/team/edit/' + id]);
  }
}
