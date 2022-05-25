import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MaletaService } from '../services/maleta/maleta-service.service';
import { RegistroService } from '../services/registro/registro-service.service';

@Component({
  selector: 'app-maleta',
  templateUrl: './maleta.component.html',
  styleUrls: ['./maleta.component.css']
})
export class MaletaComponent implements OnInit {

  objectKeys = Object.keys;
  form: any;
  maleta: any;
  registros: any;
  
  constructor(private router: ActivatedRoute,
              private formBuilder: FormBuilder,
              private _maletaService: MaletaService,
              private _registroService: RegistroService) { }

  ngOnInit(): void {
    const name = this.router.snapshot.paramMap.get('id');
    this.getMaletaInfo(name)
  }

  getMaletaInfo(name: any): void{
    const maleta = this._maletaService.getMaletaByName(name).subscribe(res => {
        this.maleta = res;

        this.form = this.formBuilder.group({
          id_maleta: this.maleta._id,
          descricao: '',
          prefix: this.maleta.prefix,
          value: ''
        });

        this.getRegistros(this.maleta._id);
    }, error => {
      console.log("Não foi possível encontrar as informações da maleta!")
    });
  }

  getRegistros(id: any): void{
    this._registroService.getRegistros(id).subscribe(res =>{
      this.registros = res;
      console.log(this.registros)
    }, error => {
      console.log("Não foi possível encontrar os registros!")
    });
  }

  clickPlus(): void{
    if ((<HTMLInputElement>document.getElementById("value")).value !== ''  && ((<HTMLInputElement>document.getElementById("value")).value[0]) !== '-'){
      this.createRegistro(1);
    }
    
  }

  clickMinus(): void{
    if ((<HTMLInputElement>document.getElementById("value")).value !== '' && ((<HTMLInputElement>document.getElementById("value")).value[0]) !== '-'){
      this.createRegistro(-1);
    }
  }

  createRegistro(signal: number): void{

    var value: number = parseFloat((<HTMLInputElement>document.getElementById("value")).value);
    const descricao = (<HTMLInputElement>document.getElementById("descricao")).value;

    value *= signal

    this.form = this.formBuilder.group({
      id_maleta: this.maleta._id,
      descricao: descricao,
      prefix: this.maleta.prefix,
      value: value
    });

    this._registroService.createRegistro(this.form.getRawValue()).subscribe(res =>{
      this.getRegistros(this.maleta._id);
      const name = this.router.snapshot.paramMap.get('id');
      this.getMaletaInfo(name);
    }, error => {
      console.log("Houve um erro no cadastro do registro!")
    });
  }

  removeRegistro(registro: any): void {
    this._registroService.removeRegistro(registro._id).subscribe(res => {
      const index = this.registros.indexOf(registro);
      this.registros.splice(registro, 1)
    });
  }

}
