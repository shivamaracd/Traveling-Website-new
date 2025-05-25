import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManifestService extends AppService<any> {
  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'manifest';
  }

  public getEditValue(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getEditValuemanifest';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

}

