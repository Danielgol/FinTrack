import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AuthService } from '../auth/auth-service.service';

export interface Usuario {
  name: String,
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient,
              private _authService: AuthService) { }

  getUserInfo() {
    const url = 'http://localhost:3000/getUserInfo';
    return this._http.get<Usuario>(url,{
      observe:'body'
    });
  }

}
