import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth-service.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.getInfo();
  }

  

  getInfo(): void{
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const objToken = {'id': id, 'token': token};

    this._authService.getInfo(objToken).subscribe(res => {
      console.log(res.sobrenome)
    });
  }



  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }

}
