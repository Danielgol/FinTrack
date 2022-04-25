import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Usuario {
  name: String,
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient) { }

  getUserInfo(body: any) {
    const url = 'http://localhost:3000/getUserInfo';
    return this._http.post<Usuario>(url, body,{
      observe:'body'
    });
  }

}
