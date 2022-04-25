import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


export interface Response {
  email: any,
  token: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  async isLogged(){
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    
    const url = 'http://localhost:3000/auth';
    try{
      const some = await this._http.post(url, {'email': email, 'token': token}).toPromise();
      return true;
    }catch(error){
      console.log(error);
      return false;
    }
  }

  login(body: any){
    const url = 'http://localhost:3000/login';
    return this._http.post<Response>(url, body,{
      observe:'body'
    });
  }

  logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
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

}
