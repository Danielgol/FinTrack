import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth-service.service';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any;

  constructor(private formBuilder: FormBuilder,
              private _authservice: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  

  submit(): void{
    this._authservice.login(this.form.getRawValue()).subscribe(res => {
      localStorage.setItem('email', res.email);
      localStorage.setItem('token', res.token);
      localStorage.setItem('expiresIn', res.expiresIn);

      this.router.navigate(['/home']);
    }, error => { 
      console.log("LOGIN_FAILED!")
    });

    /*
    const url = 'http://localhost:3000/login';
    this.http.post(url, this.form.getRawValue()).subscribe(res => {
      console.log(res)
      this.router.navigate(['home'])
    });
    */
  }


  /*
  submit(): void{
    const out = this._authservice.login(this.form.getRawValue());
    if(out === true){
      this.router.navigate(['/home']);
    }else{
      console.log("HTTP_UNAUTHORIZED");
    }
  }
  */

  faFacebookF = faFacebookF;
  faLinkedinIn = faLinkedinIn;
}
