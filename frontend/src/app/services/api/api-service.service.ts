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

  async getCurrencyPrice(curr: any, prefix: any) {
    const url = 'http://localhost:3000/getCurrencyPrice/'+curr+'/'+prefix;
    console.log(url)
    return await this._http.get<any>(url,{
      observe:'body'
    }).toPromise();
  }

  async getCriptoPrice(cripto: any, prefix: any) {
    const url = 'http://localhost:3000/getCriptoPrice/'+cripto+'/'+prefix;
    return await this._http.get<any>(url,{
      observe:'body'
    }).toPromise();
  }

  getCriptoHistory(cripto: any) {
    const url = 'http://localhost:3000/getCriptoHistory/'+cripto;
    return this._http.get<any>(url,{
      observe:'body'
    });
  }

}
