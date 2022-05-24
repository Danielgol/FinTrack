import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AuthService } from '../auth/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private _http: HttpClient,
              private _authService: AuthService) { }

  getRegistros(id: any) {
    const url = 'http://localhost:3000/getRegistros/'+id;
    return this._http.get<any>(url,{
      observe:'body'
    });
  }

  createRegistro(body: any) {
    const url = 'http://localhost:3000/createRegistro';
    return this._http.post(url, body,{
      observe:'body'
    });
  }

  removeRegistro(id: any){
    const url = 'http://localhost:3000/removeRegistro/'+id;
    return this._http.delete(url, {
      observe:'body'
    });
  }

}
