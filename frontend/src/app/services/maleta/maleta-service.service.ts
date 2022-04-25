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

  getMaletas(body: any) {
    const url = 'http://localhost:3000/getMaletas';
    return this._http.post<Maletas>(url, body,{
      observe:'body'
    });
  }

}
