import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  objectKeys = Object.keys;
  nome: any;

  constructor(private _authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.nome = "Nome do user"
  }

  
  
  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }


  anglesLeft = faAnglesLeft;
}
