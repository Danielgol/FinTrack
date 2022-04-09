import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth-service.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
      //this.banco = this.maletas[0].name
      //console.log(this.maletas);
    });
  }



  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }

}
