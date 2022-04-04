import { Component, OnInit } from '@angular/core';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  faFacebookF = faFacebookF;
  faLinkedinIn = faLinkedinIn;
}
