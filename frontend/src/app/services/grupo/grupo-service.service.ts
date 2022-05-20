import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AuthService } from '../auth/auth-service.service';

export interface Grupos {
  grupos: any,
}

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private _http: HttpClient,
              private _authService: AuthService) { }

  getGrupo() {
    const url = 'http://localhost:3000/getGrupos';
    return this._http.get<Grupos>(url, {
      observe:'body'
    });
  }

  createGrupo(body: any) {
    const url = 'http://localhost:3000/createGrupo';
    return this._http.post(url, body,{
      observe:'body'
    });
  }

}
