import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'report';
  }

  saveSearch(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'saveSearch';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

}


