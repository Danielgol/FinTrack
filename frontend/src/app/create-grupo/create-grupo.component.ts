import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth/auth-service.service';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-grupo',
  templateUrl: './create-grupo.component.html',
  styleUrls: ['./create-grupo.component.css']
})
export class CreateGrupoComponent implements OnInit {

  selectedMaletas: any;
  form: any;

  objectKeys = Object.keys;
  nome: any;
  maletas: any;

  constructor(private formBuilder: FormBuilder,
    private _authService: AuthService,
    private router: Router) { }

    ngOnInit(): void {
      this.selectedMaletas = [];
      this.getInfo();
      this.form = this.formBuilder.group({
        email: '',
        password: ''
      });
    }

    getInfo(): void{
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      const objToken = {'email': email, 'token': token};

      this._authService.getInfo(objToken).subscribe(res => {
        this.maletas = res;
        this.nome = "NOME AQUI";
        console.log(this.maletas);
      });
    }

    OnCheckboxSelect(id: any, event: any): void{
      if (event.target.checked === true) {
        this.selectedMaletas.push({id: id, checked: event.target.checked});
        console.log('Selected Ids ', this.selectedMaletas);
      }
      if (event.target.checked === false) {
        this.selectedMaletas = this.selectedMaletas.filter((item: any) => item.id !== id);
        console.log('Selected Ids ', this.selectedMaletas);
      }
    }

    submit(): void{
      console.log(this.selectedMaletas);
    }

}
