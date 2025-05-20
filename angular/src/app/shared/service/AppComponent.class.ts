// import { OnInit, ViewChild } from "@angular/core";
// // import { MatTableDataSource } from "@angular/material/table";
// // import {MatSnackBar} from '@angular/material/snack-bar';
// // import {MatSort} from '@angular/material/sort';
// // import {MatPaginator} from '@angular/material/paginator';
// import { Router } from "@angular/router";
// import { AppService } from './AppService.class';
// import { FormBuilder } from "@angular/forms";
// // import { Subscription } from "rxjs/Subscription";
// import { environment } from '../../../environments/environment';

// export class AppComponentClass<T1, T2> implements OnInit {
//     // private userid:number;
//     // public displayedColumns : any[];

//     // public cdata : T2;
//     // public cur_row : T1;
//     protected keyfield:number;
//     // public state:boolean;
//     // protected amount:number;
//     protected pkgselected:number;
//     private debug=environment.production;

//     public dataSource = new  MatTableDataSource<T1>();


//     // public tag_label:string;
//     // protected subscribe: Subscription;

//     constructor(protected data: AppService<T1>, protected router: Router,
//       protected fb?: FormBuilder) {
//         // this.userid=parseInt(sessionStorage.getItem('userid'));
//         this.keyfield=-1;
//         // this.amount=null;
//         this.pkgselected=-1;
//     }

//     public debug_log(log:string)
//     {
//       if(!this.debug){
//       // console.log(log);
//       }
//     }

//     ngOnInit()
//     {
//         // this.data.frm_label.subscribe(res=>{this.tag_label=res;});
//         // this.data.status.subscribe(res=>{this.state=res;});
//         this.loadDataSource();
//     }

//     loadDataSource()
//     {
//       // this.data.getService().subscribe(res=>{
//       //   this.debug_log(res.toString());
//       //   this.dataSource.data=res;
//       // });
//     }

//     applyFilter(filterValue: string) {
//       filterValue = filterValue.trim();
//       filterValue = filterValue.toLowerCase();
//       this.dataSource.filter = filterValue;
//     }


//     Edit(row:T1)
//     {
//       this.data.changelabel("Edit Details");
//       this.data.Data=row;
//       this.data.changefrm(true);
//     }

//     Delete(id:number)
//     {
//       console.log("deleted row :"+JSON.stringify(id));
//       // this.data.deleteService(id).subscribe( data =>
//       //   {
//       //     this.loadDataSource();
//       //     this.openSnackBar("Data is deleted successfully","Clear");
//       //   }
//       // );
//     }

//     openSnackBar(message: string, action: string) {
//       // this.snackBar.open(message, action, {
//       //   duration: 2000
//       //   ,verticalPosition: 'top',
//       //   horizontalPosition: 'center',
//       //   panelClass:['snackbarwarn']
//       // });
//     }

//     onSubmit()
//     {
//         // this.debug_log("Thanks for submitting! Data: " + JSON.stringify(this.cdata));
//         this.debug_log("keyfield:::" + this.keyfield.toString());
//       //  this.debug_log(''+this.keyfield+'');
//         if(this.keyfield==-1)
//         {
//           //   this.data.saveService(JSON.stringify(this.cdata)).subscribe( rs =>  {
//           //   this.loadDataSource();
//           //   this.openSnackBar("Data is added successfully","Clear");
//           //   this.data.changefrm(false);
//           //   this.data.changelabel("List Details");
//           // });
//         }
//         else
//         {
//             // this.data.updateService(JSON.stringify(this.cdata), this.keyfield).subscribe( rs =>
//             // {
//             //   this.loadDataSource();
//             //   this.openSnackBar("Data is updated successfully","Clear");
//             //   this.data.changefrm(false);
//             //   // this.data.Data=null;
//             //   this.data.changelabel("List Details");
//             // });
//         }

//     }

//     onDestroy()
//     {
//       this.data.frm_label.unsubscribe();
//       // this.subscribe.unsubscribe();
//     }
//   }
