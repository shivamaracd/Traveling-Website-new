import { AppService } from '../shared/service/AppService.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManifestService extends AppService<any> {
  private apiUrl = 'http://localhost:3000/api/manifests';

  constructor(public override http: HttpClient) {
    super(http);
    this.appmod = 'manifest';
  }

  // override getService(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}`);
  // }

  override saveService(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  editDataManifest(data: any): Observable<any> {
    if (typeof data === 'string' || typeof data === 'number') {
      return this.http.get<any>(`${this.apiUrl}/${data}`);
    } else {
      return this.http.put<any>(`${this.apiUrl}/${data.id}`, data.data);
    }
  }

  deleteManifest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

