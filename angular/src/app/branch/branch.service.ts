

import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { uploadsounds } from '../app-routing.module';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BranchService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'branch';
  }


  editDataBranch(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'editDataBranch';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  saveBranchData(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'saveBranchData';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  updateBranchData(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updateBranchData';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  getLastBranchId(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getLastBranchId';
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }
}

