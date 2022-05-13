import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Maletas {
  maletas: any,
}

@Injectable({
  providedIn: 'root'
})
export class MaletaService {

  constructor(private _http: HttpClient) { }

  getMaletaByName(body: any){
    const url = 'http://localhost:3000/getMaletaByName';
    return this._http.post<any>(url, body,{
      observe:'body'
    });
  }

  getMaletas(body: any) {
    const url = 'http://localhost:3000/getMaletas';
    return this._http.post<Maletas>(url, body,{
      observe:'body'
    });
  }

  createMaleta(body: any){
    const url = 'http://localhost:3000/createMaleta';
    return this._http.post(url, body,{
      observe:'body'
    });
  }

}
