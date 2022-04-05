import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface Response {
  email: any,
  token: string,
  expiresIn: any
}

export interface Info {
  maletas: any,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  login(body: any){
    const url = 'http://localhost:3000/login';
    return this._http.post<Response>(url, body,{
      observe:'body'
    });
  }


  /*
  https://blog.angular-university.io/angular-jwt-authentication/
  https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/
  https://www.youtube.com/watch?v=D0gpL8-DVrc&ab_channel=LuizTools
  https://www.youtube.com/watch?v=7G7qzlblJcI&ab_channel=CodeShotsWithProfanis
  https://www.youtube.com/watch?v=gOuJE6d_l-U&ab_channel=Celke
  https://www.youtube.com/watch?v=toRmWFzB6-E&ab_channel=AzharHusain
  https://github.com/AzharHusain/token-based-authentication/
  */



  /*
  login(body: any){
    var log = false;
    const url = 'http://localhost:3000/login';
    this._http.post<Response>(url, body).subscribe(res => {
      this.setSession(res);
      log = true;
    }, error => { 
      log = false;
    });
    return log;
  }
  */

  

  logout() {
    // Enviar mensagem para retirar o token do servidor
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
  }

  private setSession(res: any) {
    localStorage.setItem('email', res.email);
    localStorage.setItem('token', res.token);
    localStorage.setItem('expiresIn', res.expiresIn);
    /*
    const expiresAt = moment().add(authResult.expiresIn,'second');
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    */
  }

  getInfo(body: any){
    const url = 'http://localhost:3000/getInfo';
    return this._http.post<Info>(url, body,{
      observe:'body'
    });
  }



}
