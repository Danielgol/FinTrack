import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

import { GrupoService } from '../services/grupo/grupo-service.service';
import { MaletaService } from '../services/maleta/maleta-service.service';


@Component({
  selector: 'app-create-grupo',
  templateUrl: './create-grupo.component.html',
  styleUrls: ['./create-grupo.component.css']
})
export class CreateGrupoComponent implements OnInit {

  selectedMaletas: any;
  form: any;

  objectKeys = Object.keys;
  maletas: any;

  errorMessage: any;

  constructor(private formBuilder: FormBuilder,
    private _grupoService: GrupoService,
    private _maletaService: MaletaService,
    private router: Router) { }

    ngOnInit(): void {
      this.form = this.formBuilder.group({
        name: '',
        prefix: '',
        maletas: ''
      });
      this.selectedMaletas = [];
      this.getMaletas();
    }

    getMaletas(): void{
      this._maletaService.getMaletas().subscribe(res => {
        this.maletas = res;
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
      const id_maletas = this.selectedMaletas.map((item: any) => {
          return item.id
      });

      const name = (<HTMLInputElement>document.getElementById("name")).value;
      const prefix = (<HTMLInputElement>document.getElementById("prefix")).value;

      this.form = this.formBuilder.group({
        name: name,
        prefix: prefix,
        maletas: this.formBuilder.array(id_maletas)
      });

      this._grupoService.createGrupo(this.form.getRawValue()).subscribe(res => {
        this.router.navigate(['/home']);
      }, error => {
        this.errorMessage = error.error.message
      });
    }

}
