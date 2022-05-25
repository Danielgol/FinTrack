import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AuthService } from '../auth/auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private _http: HttpClient,
              private _authService: AuthService) { }

  getGrupos() {
    const url = 'http://localhost:3000/getGrupos';
    return this._http.get<any>(url, {
      observe:'body'
    });
  }

  getGrupo(name: any) {
    const url = 'http://localhost:3000/getGrupo/' + name;
    return this._http.get<any>(url, {
      observe:'body'
    });
  }

  createGrupo(body: any) {
    const url = 'http://localhost:3000/createGrupo';
    return this._http.post(url, body,{
      observe:'body'
    });
  }

  removeGrupo(id: any) {
    const url = 'http://localhost:3000/removeGrupo/'+id;
    return this._http.delete(url, {
      observe:'body'
    });
  }

}
