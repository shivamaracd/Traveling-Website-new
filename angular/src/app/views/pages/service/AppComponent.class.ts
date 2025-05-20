// import { Component, OnInit, ViewChild } from "@angular/core";
// import { Router } from "@angular/router";
// import { AppService } from './AppService.class';
// import { FormBuilder } from "@angular/forms";
// // import { NgToastService } from 'ng-angular-popup';
// import { Subscription } from "rxjs";
// import { environment } from "../../../../environments/environment";
// import { NgToastService } from "ng-angular-popup";
// declare var $: any; 
// @Component({
//   selector: 'basecomponent',
//   template: '<div></div>'
// })
// export class AppComponentClass<T1, T2> implements OnInit {

//   protected userid: number;
//   public displayedColumns: any[];
//   public cdata: T2;
//   public cur_row: T1;
//   protected keyfield: number;
//   public state: boolean;   
//   protected amount: number;
//   protected pkgselected: number;
//   private debug = environment.production;
//   public tag_label: string;
//   protected subscribe: Subscription;
//   public dataSource: any = "";

//   // @ViewChild(MatSort , null  ) protected sort: MatSort;
//   // @ViewChild(MatPaginator , null) protected paginator: MatPaginator;

//   constructor(protected data: AppService<any>, protected router: Router, public toastMessage: NgToastService,
//     protected fb?: FormBuilder,) {
//     this.userid = parseInt(sessionStorage.getItem('iduser'));
//     this.keyfield = -1;
//     this.amount = null;
//     this.pkgselected = -1;
//   }

//   ngOnInit() {

//     // this.data.frm_label.subscribe(res => { this.tag_label = res; });
//     // this.data.status.subscribe(res => { this.state = res; });
//     this.loadDataSource();
//   }

//   loadDataSource() {
//     this.data.getService().subscribe(res => {
//       $('#myTable').DataTable().clear();
// 			$('#myTable').DataTable().destroy();
//       this.debug_log(res);
//       this.dataSource = res;
//       $.getScript('./assets/js/table.js');
//     });
//   }

  

//   applyFilter(filterValue: string) {
//     filterValue = filterValue.trim();
//     filterValue = filterValue.toLowerCase();
//     this.dataSource.filter = filterValue;
//   }

//   onSubmit() {
//     this.debug_log("Thanks for submitting! Data: " + JSON.stringify(this.cdata));
//     this.debug_log("keyfield:::" + this.keyfield.toString());
//     //  this.debug_log(''+this.keyfield+'');
//     if (this.keyfield == -1) {
//       this.data.saveService(JSON.stringify(this.cdata)).subscribe(
//         res => {
//           console.log('Save data ::', res)
//           this.loadDataSource();
//           this.data.changefrm(false);
//           // this.data.changelabel("List Details");
//           setTimeout(() => {
//             this.alertMessage("Success Message", res.message);
//           }, 3000)
          
//         },
//         err => {
//           this.alertMessage("Error Message", err)
//         }
//       );
//     }
//     else {
//       this.data.updateService(JSON.stringify(this.cdata), this.keyfield).subscribe(res => {
//         console.log('Update data ::', res)
//         this.loadDataSource();
//         this.data.changefrm(false);
//         this.data.Data = null;
//         // this.data.changelabel("List Details");
//         setTimeout(() => {
//           this.alertMessage("Success Message", res.message);
//         }, 3000)
//         // this.alertMessage("Success Message", res.message)
//       },
//         err => {
//           this.alertMessage("Error Message", err)
//         });
//     }
//   }

//   Delete(id: number) {
//     console.log("deleted row :" + JSON.stringify(id));
//     this.data.deleteService(id).subscribe(
//       data => {
//         this.loadDataSource();
//         setTimeout(() =>{
//           this.alertMessagefordelete("Success Message", data.message)
//         }, 3000)
//       },
//       err => {
//         this.alertMessagefordelete("Error Message", err)
//       }
//     );
//   }

//   Edit(row: any) {
//     this.data.changelabel("Edit Details");
//     this.data.Data = row;
//     this.data.changefrm(true);
//   }

//   alertMessage(action: any, message: any) {
//     this.toastMessage.success({ detail: action, summary: message, duration: 3000 })
//   }

//   alertMessagefordelete(action: any, message: any) {
//     this.toastMessage.success({ detail: action, summary: message, duration: 3000 })
//   }

//   debug_log(log: any) {
//     console.log(log);
//   }

//   onDestroy() {
//     this.data.frm_label.unsubscribe();
//     this.subscribe.unsubscribe();
//   }

//   // ngAfterViewInit() {
//   //   this.dataSource.paginator = this.paginator;
//   //   this.dataSource.sort = this.sort;
//   // }

// }