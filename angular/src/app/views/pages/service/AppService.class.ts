import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APIURL, CIAPIURL } from '../../../app-routing.module';
import { Option } from '../model/page.models';

export class AppService<T> {
  protected appmod: string | undefined;
  //protected action : string;
  protected userkey: number | undefined;
  protected userid: number | undefined;
  private debug = environment.production;

  public service_data = new BehaviorSubject<T | null>(null);
  public solution = this.service_data.asObservable();

  public frm_label = new BehaviorSubject<string>("List Details");
  public label = this.frm_label.asObservable();
  public frm_status = new BehaviorSubject<boolean>(false);
  public status = this.frm_status.asObservable();

  constructor(protected http: HttpClient) { console.log(APIURL); }

  public debug_log(log: string) {
    if (!this.debug)
      console.log(log);
  }

  /* public get Action() : string {
    return this.action
  }
  
  public set Action(v : string) {
    this.action = v;
  } */

  public set Data(v: T) {
    this.debug_log("Setting current data");
    this.service_data.next(v);
  }

  changefrm(value: boolean) {
    this.frm_status.next(value);
  }

  changelabel(lbl: string) {
    this.frm_label.next(lbl);
  }

  public getOption(data: string): Observable<Option[]> {
    console.log(APIURL + this.appmod + "/" + data);
    return this.http.get<Option[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: data } });
  }

  public getOptionParams(data: any, filter: any): Observable<Option[]> {
    return this.http.get<Option[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: data, data: filter } });
  }

  public getDownload(data: string, type: string = 'download'): Observable<Blob> {
    return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/octet-stream" }, params: { type: type, data: data }, responseType: 'blob', observe: 'body' });
  }

  public Download(data: string, filename: string): Observable<Blob> {
    this.debug_log(APIURL + "download/" + data);
    return this.http.post(APIURL + "download/" + data, { "filename": filename }, { headers: { "Content-Type": "application/octet-stream" }, params: { "filename": filename }, responseType: 'blob', observe: 'body' });
  }

  public getReportwhere(data: string, where?: string): Observable<any> {
    if (where == undefined)
      return this.http.get<T[]>(APIURL + "reports/" + data + "/");
    else
      return this.http.get<T[]>(APIURL + "reports/" + data + "/", { headers: { "Content-Type": "application/json" }, params: { where } });
  }

  public getService(type?: string, filter?: any, where?: string): Observable<T[]> {
    if (filter == undefined) {
      if (where == undefined) {
        if (type != undefined)
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type } });
        else
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main" } });
      }
      else {
        if (type != undefined)
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type, where } });
        else
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main", where } });
      }
    }
    else {
      if (where == undefined) {
        if (type != undefined)
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type, filter: filter } });
        else
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main", filter: filter } });
      }
      else {
        if (type != undefined)
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type, where, filter: filter } });
        else
          return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main", where, filter: filter } });
      }
    }
  }

  public getCiOption(url: string, key?: string): Observable<Option[]> {
    if (key !== undefined && key !== null) {
      return this.http.get<Option[]>(CIAPIURL + this.appmod + "/" + url, { headers: { "Content-Type": "application/json" }, params: { state: key } });
    } else {
      return this.http.get<Option[]>(CIAPIURL + this.appmod + "/" + url);
    }
  }

  // public getCiService(url: string, key?: string, value?: string): Observable<T[]> {
  //   if (key !== undefined && key !== null) {
  //     return this.http.get<T[]>(CIAPIURL + this.appmod + "/" + url, { headers: { "Content-Type": "application/json" }, params: { key: value } });
  //   } else if (value !== null && value !== undefined) {
  //     return this.http.get<T[]>(CIAPIURL + this.appmod + "/" + url + "/" + value);
  //   } else {
  //     return this.http.get<T[]>(CIAPIURL + this.appmod + "/" + url);
  //   }
  // }

  public saveCiService(url: string, data: any, type?: string): Observable<any> {
    if (type != undefined)
      return this.http.post<any>(CIAPIURL + this.appmod + "/" + url, data, { headers: { "Content-Type": "application/json" }, params: { type: "main" } });
    else
      return this.http.post<any>(CIAPIURL + this.appmod + "/" + url, data, { headers: { "Content-Type": "application/json" }, params: { type: "main" } });
  }

  // public getReport(data: string): Observable<any> {
  //   this.debug_log(APIURL + "reports/" + data + "/");
  //   this.userkey = parseInt(sessionStorage.getItem('type'));
  //   this.userid = parseInt(sessionStorage.getItem('iduser'));
  //   if (this.userkey == 1)
  //     return this.http.get<T[]>(APIURL + "reports/" + data + "/");
  //   else
  //     return this.http.get<T[]>(APIURL + "reports/" + data + "/");
  // }

  public getAllCampaign(): Observable<any> {
    return this.http.get<any>(APIURL + 'custom/allcampaign/', { headers: { "Content-Type": "application/json" }, params: { type: "main" } });
  }

  public getServiceParam(type?: string, filter?: any): Observable<T[]> {
    if (filter == undefined) {
      if (type != undefined)
        return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type } });
      else
        return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main" } });
    }
    else {
      if (type != undefined)
        return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type, where: filter } });
      else
        return this.http.get<T[]>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main", where: filter } });
    }
  }

  public PatchEvent(url: string, campid: number, filter?: any, type?: string): Observable<any> {
    console.log('REQUESTTYPE:::' + type);
    if (type != undefined) {
      return this.http.patch<any>(APIURL + url, "", { headers: { "Content-Type": "application/json" }, params: { type: type, campaign_id: campid.toString(), filter: filter } });
    } else {

      return this.http.patch<any>(APIURL + url, "", { headers: { "Content-Type": "application/json" }, params: { type: "main", campaign_id: campid.toString(), filter: filter } });
    }
  }


  public saveService(data: any, type?: string): Observable<any> {
    console.log("Req===>" + JSON.stringify(data));
    if (type != undefined)
      return this.http.post<any>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { type } });
    else
      return this.http.post<any>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { type: "main" } });
  }

  /** custom services **/
  public customGetServiceUI(url: string, data?: any): Observable<any> {
    return this.http.get<any>(APIURL + url, { headers: { "Content-Type": "application/json" }, params: { type: "main", filter: JSON.stringify(data) } });
  }

  public detailService(key: number, type?: string): Observable<T> {
    if (type != undefined)
      return this.http.get<T>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: type } });
    else
      return this.http.get<T>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: "detail" } });
  }

  public statusService(data: any, key: number, type?: string): Observable<string> {
    if (type != undefined)
      return this.http.put<string>(APIURL + this.appmod, { "data": data, "id": key }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: type } });
    else
      return this.http.put<string>(APIURL + this.appmod, { "data": data, "id": key }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: "status" } });
  }

  public updateService(data: any, key: number, type?: string, filter?: string): Observable<T> {
    if (type != undefined) {
      if (filter != undefined)
        return this.http.put<T>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: type, filter: JSON.stringify(filter) } });
      else
        return this.http.put<T>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: type } });
    }
    else {
      if (filter != undefined)
        return this.http.put<T>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: "main", filter: JSON.stringify(filter) } });
      else
        return this.http.put<T>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: "main" } });
    }
  }

  public updatePassword(data: any, key: number): Observable<T> {
    return this.http.put<T>(APIURL + 'custom/changepassword/', { "data": data }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString() } });
  }


  // public deleteService(key:number, type?:string): Observable<T>
  // {
  //   if(type!=undefined)
  //     return this.http.delete<T>(APIURL+this.appmod, { headers: {"Content-Type": "application/json"}, params: {id:key.toString(), type:type}});
  //   else
  //     return this.http.delete<T>(APIURL+this.appmod, { headers: {"Content-Type": "application/json"}, params: {id:key.toString(),type:"main"}});
  // }

  public deleteService(key: number, type?: string): Observable<T> {
    if (type != undefined)
      return this.http.delete<T>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: type } });
    else
      return this.http.delete<T>(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: "main" } });
  }

  public PatchService(data: any, key: number, type?: string): Observable<T> {
    if (type != undefined)
      return this.http.patch<T>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: type } });
    else
      return this.http.patch<T>(APIURL + this.appmod, { "data": data }, { headers: { "Content-Type": "application/json" }, params: { id: key.toString(), type: "main" } });
  }

  public customGetService(url: string, filter?: any): Observable<any> {
    return this.http.get<any>(APIURL + url, { headers: { "Content-Type": "application/json" }, params: { filter } });
  }

  public DownloadCdrCustomService(type?: string, filter?: any, where?: string): Observable<Blob> {
    if (filter == undefined) {
      if (where == undefined) {
        if (type != undefined)
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type }, responseType: 'blob', observe: 'body' });
        else
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main" }, responseType: 'blob', observe: 'body' });
      }
      else {
        if (type != undefined)
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type, where }, responseType: 'blob', observe: 'body' });
        else
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main", where }, responseType: 'blob', observe: 'body' });
      }
    }
    else {
      /* if(type!=undefined)
        return this.http.get<T[]>(APIURL+this.appmod,{headers:{"Content-Type": "application/json"}, params:{type, filter: filter}});
      else
        return this.http.get<T[]>(APIURL+this.appmod, {headers:{"Content-Type": "application/json"}, params:{type:"main", filter: filter}}); */

      if (where == undefined) {
        if (type != undefined)
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type, filter: filter }, responseType: 'blob', observe: 'body' });
        else
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main", filter: filter }, responseType: 'blob', observe: 'body' });
      }
      else {
        if (type != undefined)
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type, where, filter: filter }, responseType: 'blob', observe: 'body' });
        else
          return this.http.get(APIURL + this.appmod, { headers: { "Content-Type": "application/json" }, params: { type: "main", where, filter: filter }, responseType: 'blob', observe: 'body' });
      }
    }
  }

  public customDeleteServiceUI(url: string, data: any): Observable<any> {
    let options: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        data: JSON.stringify(data)
      }
    }
    return this.http.delete<any>(APIURL + url, options)
  }

}