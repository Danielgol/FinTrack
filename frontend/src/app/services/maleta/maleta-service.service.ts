import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AuthService } from '../auth/auth-service.service';

export interface Maletas {
  maletas: any,
}

@Injectable({
  providedIn: 'root'
})
export class MaletaService {

  constructor(private _http: HttpClient,
              private _authService: AuthService) { }

  removeMaletaByName(name: any) {
    const url = 'http://localhost:3000/removeMaleta/'+name;
    return this._http.delete<any>(url,{
      observe:'body'
    });
  }

  getMaletaByName(name: any) {
    const url = 'http://localhost:3000/getMaleta/'+name;
    return this._http.get<any>(url,{
      observe:'body'
    });
  }

  getMaletas() {
    const url = 'http://localhost:3000/getMaletas';
    return this._http.get<Maletas>(url,{
      observe:'body'
    });
  }

  createMaleta(body: any){
    const url = 'http://localhost:3000/createMaleta';
    return this._http.post(url, body,{
      observe:'body'
    });
  }

  getMaletasByGrupo(name: any){
    const url = 'http://localhost:3000/getMaletasByGrupo/'+name;
    return this._http.get<Maletas>(url,{
      observe:'body'
    });
  }

}
