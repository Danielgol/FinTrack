import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-grupo',
  templateUrl: './create-grupo.component.html',
  styleUrls: ['./create-grupo.component.css']
})
export class CreateGrupoComponent implements OnInit {

  form: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router) { }

    ngOnInit(): void {
      this.form = this.formBuilder.group({
        email: '',
        password: ''
      });
    }

}
