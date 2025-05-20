import { Injectable } from '@angular/core';
import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { uploadsounds } from '../app-routing.module';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService extends AppService<any> {

  constructor( http: HttpClient) {
     super(http)
    this.appmod = 'team'
   }

   public addexuctiveuser(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = "addexuctiveuserdata";
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }


   public saveMember(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = "saveMember";
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
   }


   getMemberById(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'getMemberbyid';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }


  updateMember(data: any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = 'updateMember';
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }




   //below are services this is only for understanding
   
  public ParticulerExcData(): Observable<any> {
    let tmp = this.appmod;
    this.appmod = "getParticulerExcData";
    let result = super.getService();
    this.appmod = tmp;
    return result;
  }

  getDatawithCallduration(data:any): Observable<any> {
    let tmp = this.appmod;
    this.appmod = "getDatawithCallduration";
    let result = super.saveService(data);
    this.appmod = tmp;
    return result;
  }

  


}
