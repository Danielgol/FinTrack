import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth-service.service';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft, faCoffee } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any;
  errorMessage: any;

  constructor(private formBuilder: FormBuilder,
              private _authservice: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  submit(): void{
    this._authservice.login(this.form.getRawValue()).subscribe(res => {
      localStorage.setItem('email', res.email);
      localStorage.setItem('token', res.token);
      this.router.navigate(['/home']);
    }, error => {
      this.errorMessage = error.error.message;
    });
  }

  faFacebookFa = faFacebookF;
  faLinkedinIn = faLinkedinIn;
  anglesLeft = faAnglesLeft;
}
