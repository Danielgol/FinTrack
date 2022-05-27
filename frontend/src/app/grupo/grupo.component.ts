import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoService } from '../services/grupo/grupo-service.service';
import { MaletaService } from '../services/maleta/maleta-service.service';
import { ApiService } from '../services/api/api-service.service';

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

  errorMessage: any;

  constructor(private _grupoService: GrupoService,
    private _maletaService: MaletaService,
    private _apiService: ApiService,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    const name = this.router.snapshot.paramMap.get('id');
    this.getGrupo(name);
  }

  getGrupo(name: any): void{
    this._grupoService.getGrupo(name).subscribe(res => {
      this.grupo = res;
      this.getMaletas(name);
    }, error => {
      this.errorMessage = error.error.message;
    });
  }

  getMaletas(name: any): void{
    this._maletaService.getMaletasByGrupo(name).subscribe(res => {
      this.maletas = res;
      this.calcularSaldoGrupo(this.grupo.prefix);
    });
  }

  /*
  removeMaleta(maleta: any): void {
    this._maletaService.removeMaletaFromGrupo(this.grupo.name, maleta._id).subscribe(res => {
      this.grupo = res;
      const index = this.maletas.indexOf(maleta);
      this.maletas.splice(index, 1);
      this.calcularSaldoGrupo();
    });
  }
  */

  async calcularSaldoGrupo(generalPrefix: any): Promise<any>{
    var saldo = 0;
    for(var i=0; i<this.maletas.length; i++) {
      const value = this.maletas[i].value;
      const prefix = this.maletas[i].prefix;
      // Awaits devem ser colocados no local onde será feita a operação
      // real, se não ele dará resposta promise. PS: O código está correto.
      const resp = await this.convertToPrefix(value, prefix, generalPrefix);
      saldo += resp;
    }
    this.saldo_grupo = saldo;
  }

  async convertToPrefix(value: any, prefix: any, generalPrefix: any): Promise<number>{

    if(generalPrefix === prefix){
      return value;
    }

    // ? PARA CRIPTO
    if(generalPrefix === "BTC" || generalPrefix === "ETH"){
      var price: any;
      price = await this._apiService.getCriptoPrice(prefix, generalPrefix);
      return price.value * value;
    }

    // CRIPTO PARA ?
    if(prefix === "BTC" || prefix === "ETH"){
      var price: any;
      price = await this._apiService.getCriptoPrice(prefix, generalPrefix);
      return price.value * value;
    }

    // MOEDA NORMAL PARA MOEDA NORMAL
    var price: any;
    price = await this._apiService.getCurrencyPrice(prefix, generalPrefix);
    return price.value * value

  }

}
