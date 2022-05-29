import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { MaletaService } from '../services/maleta/maleta-service.service';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-create-maleta',
  templateUrl: './create-maleta.component.html',
  styleUrls: ['./create-maleta.component.css']
})
export class CreateMaletaComponent implements OnInit {

  form: any;
  errorMessage: any;

  constructor(private formBuilder: FormBuilder,
              private _maletaservice: MaletaService,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      value: '',
      prefix: '',
    });
  }

  submit(): void{
    this._maletaservice.createMaleta(this.form.getRawValue()).subscribe(res => {
      this.router.navigate(['/home']);
    }, error => {
      this.errorMessage = error.error.message
    });
  }

}
