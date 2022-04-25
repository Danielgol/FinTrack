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
              private router: Router) {}

  ngOnInit(): void {
    this.getMaletas();
    console.log(this.maletas)
  }

  
  getMaletas(): void{
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    this._authService.getMaletas({'email': email, 'token': token}).subscribe(res => {
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
