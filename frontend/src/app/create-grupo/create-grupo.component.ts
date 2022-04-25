import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth/auth-service.service';
import { MaletaService } from '../services/maleta/maleta-service.service';
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
    private _maletaService: MaletaService,
    private router: Router) { }

    ngOnInit(): void {
      this.selectedMaletas = [];
      this.getMaletas();
      this.form = this.formBuilder.group({
        name: '',
        prefix: ''
      });
    }

    getMaletas(): void{
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      this._maletaService.getMaletas({'email': email, 'token': token}).subscribe(res => {
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
