import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastr: ToastrService) { }

  displaySuccess(message: any){
    this.toastr.success(message)
  }
  displayError(message: any){
    this.toastr.error(message)
  }

  displayAlert(message: { type: any; msg: any; data?: string; duration: any; }){
    if(message.type=="success"){
      this.toastr.success(message.msg,"",{timeOut:message.duration});
    }
    else if(message.type=="error"){
      this.toastr.error(message.msg,"",{timeOut:message.duration});
    }
  }
}
