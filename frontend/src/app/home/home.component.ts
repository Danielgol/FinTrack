import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service.service';
import { MaletaService } from '../services/maleta/maleta-service.service';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft, faCoffee } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  objectKeys = Object.keys;
  maletas: any;

  constructor(private _authService: AuthService,
              private _maletaService: MaletaService,
              private router: Router) {}

  ngOnInit(): void {
    this.getMaletas();
    console.log(this.maletas)
  }

  
  getMaletas(): void{
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    this._maletaService.getMaletas({'email': email, 'token': token}).subscribe(res => {
      this.maletas = res;
      console.log(this.maletas);
    });
  }


  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }


  anglesLeft = faAnglesLeft;
}
