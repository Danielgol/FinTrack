import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth-service.service';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft, faCoffee } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  objectKeys = Object.keys;
  nome: any;
  maletas: any;

  constructor(private _authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.getInfo();
    console.log(this.maletas)
  }

  

  getInfo(): void{
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    const objToken = {'email': email, 'token': token};

    this._authService.getInfo(objToken).subscribe(res => {
      this.maletas = res;
      this.nome = "NOME AQUI";
      console.log(this.maletas);
    });
  }



  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }


  anglesLeft = faAnglesLeft;
}
