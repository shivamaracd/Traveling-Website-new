import { Injectable } from '@angular/core';
import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { uploadsounds } from '../app-routing.module';
@Injectable({
  providedIn: 'root'
})
export class TaskService extends AppService<any> {

  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'task';
  }

  editData(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editDatda';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  editTask(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editTask';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }


}
