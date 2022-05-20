import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface History {
  id: string,
  prices: [],
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient) { }

  getCriptoPrice(cripto: any) {
    const url = 'http://localhost:3000/getCriptoPrice/'+cripto;
    return this._http.get<any>(url,{
      observe:'body'
    });
  }

  getCriptoHistory(cripto: any) {
    const url = 'http://localhost:3000/getCriptoHistory/'+cripto;
    return this._http.get<any>(url,{
      observe:'body'
    });
  }

}
