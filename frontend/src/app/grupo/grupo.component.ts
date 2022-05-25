import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoService } from '../services/grupo/grupo-service.service';
import { MaletaService } from '../services/maleta/maleta-service.service';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit {

  objectKeys = Object.keys;

  grupo: any;
  maletas: any;
  saldo_grupo: any;

  constructor(private _grupoService: GrupoService,
    private _maletaService: MaletaService,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    const name = this.router.snapshot.paramMap.get('id');
    this.getGrupo(name);
    this.getMaletas(name);
  }

  getGrupo(name: any): void{
    this._grupoService.getGrupo(name).subscribe(res => {
      this.grupo = res;
    });
  }

  getMaletas(name: any): void{
    this._maletaService.getMaletasByGrupo(name).subscribe(res => {
      this.maletas = res;
      this.calcularSaldoGrupo();
    });
  }

  calcularSaldoGrupo(): void{
    var saldo = 0;

    for(var i=0; i<this.maletas.length; i++){
      saldo += this.maletas[i].value  
    }

    console.log(saldo)
    this.saldo_grupo = saldo;
  }

  removeMaleta(maleta: any): void {
    this._maletaService.removeMaletaFromGrupo(this.grupo.name, maleta._id).subscribe(res => {
      this.grupo = res;
      const index = this.maletas.indexOf(maleta);
      this.maletas.splice(index, 1);
    });
  }

}
