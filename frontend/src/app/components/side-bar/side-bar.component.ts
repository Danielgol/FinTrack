import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth/auth-service.service';
import { UsuarioService } from 'src/app/services/usuario/usuario-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  objectKeys = Object.keys;
  name: any;

  constructor(private _authService: AuthService,
              private _usuarioService: UsuarioService,
              private router: Router) {}

  ngOnInit(): void{
    this.getUserInfo()
  }

  getUserInfo(): void{
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    this._usuarioService.getUserInfo({'email': email, 'token': token}).subscribe(res => {
      this.name = res.name;
    });
  }

  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }

  anglesLeft = faAnglesLeft;
}
