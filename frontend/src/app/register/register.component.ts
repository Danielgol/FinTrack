import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any;
  errorMessage: any;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      email: '',
      password: '',
      confirmedPassword: ''
    });
  }

  submit(): void{
    console.log(this.form.getRawValue());

    const url = 'http://localhost:3000/register';

    this.http.post(url, this.form.getRawValue()).subscribe(res => {
      this.router.navigate(['login']);
    }, error => {
      this.errorMessage = error.error.message
    });
  }
  faFacebook = faFacebookF;
  faLinkedin = faLinkedinIn;
  anglesLeft = faAnglesLeft;
} 
