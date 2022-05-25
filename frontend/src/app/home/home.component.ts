import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service.service';
import { GrupoService } from '../services/grupo/grupo-service.service';
import { MaletaService } from '../services/maleta/maleta-service.service';
import { ApiService } from '../services/api/api-service.service';
import { faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faAnglesLeft, faCoffee } from '@fortawesome/free-solid-svg-icons';

import { Chart, registerables } from 'node_modules/chart.js'



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  objectKeys = Object.keys;
  maletas: any;
  grupos: any;
  saldo_geral: any;
  btc_current: any;

  chart: any;
  coin_data = [];

  constructor(private _authService: AuthService,
              private _maletaService: MaletaService,
              private _grupoService: GrupoService,
              private _apiService: ApiService,
              private router: Router) {}




  ngOnInit(): void {
    this.getMaletas();
    this.getGrupos();
    this.getCriptoHistory("btc");
  }  

  onSelectMaleta(name: any): void{
    this.router.navigate(['/maleta', name]);
  }

  onDeleteMaleta(name: any): void{
    this._maletaService.removeMaletaByName(name).subscribe(res => {
      this.maletas = res;
      this.calcularSaldoGeral("BRL");
    });
  }

  onSelectGrupo(grupo: any): void{
    this.router.navigate(['grupo',grupo.name])
  }

  onDeleteGrupo(grupo: any): void{
    const index = this.grupos.indexOf(grupo);
    this._grupoService.removeGrupo(grupo._id).subscribe(res => {
      // Gambiarra  \(*U*)/
      window.location.reload();
    });
  }

  getMaletas(): void{
    this._maletaService.getMaletas().subscribe(res => {
      this.maletas = res;
      this.calcularSaldoGeral("BRL");
    });
  }

  getGrupos(): void{
    this._grupoService.getGrupos().subscribe(res => {
      this.grupos = res;
    });
  }

  async calcularSaldoGeral(generalPrefix: any): Promise<any>{
    var saldo = 0;
    for(var i=0; i<this.maletas.length; i++) {
      const value = this.maletas[i].value;
      const prefix = this.maletas[i].prefix;
      // Awaits devem ser colocados no local onde será feita a operação
      // real, se não ele dará resposta promise. PS: O código está correto.
      const resp = await this.convertToPrefix(value, prefix, generalPrefix);
      saldo += resp;
    }
    this.saldo_geral = saldo;
  }

  async convertToPrefix(value: any, prefix: any, generalPrefix: any): Promise<number>{

    if(generalPrefix === prefix){
      return value;
    }

    if(prefix === "BTC" || prefix === "ETH"){
      var price: any;
      price = await this._apiService.getCriptoPrice(prefix, generalPrefix);
      return price.value * value;
    }else{
      var price: any;
      price = await this._apiService.getCurrencyPrice(prefix, generalPrefix);
      return price.value * value
    }

    /*
    if(generalPrefix === "BTC" || generalPrefix === "ETH"){
      var price: any;
      price = await this._apiService.getCriptoPrice(generalPrefix, prefix);
      return price.value * value;
    }
    */

    return 0;

  }

  getCriptoHistory(cripto: any): void{
    this._apiService.getCriptoHistory(cripto).subscribe(res => {

      var resp_json = JSON.parse(JSON.stringify(res));

      this.btc_current = resp_json[0].current_price
      this.coin_data = resp_json[0].sparkline_in_7d.price
      var labels = []

      for(var i=0; i<this.coin_data.length; i++){
        labels.push("")
      }

      Chart.register(...registerables);
      this.chart = new Chart("myChart", {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
              data: this.coin_data,
              borderColor: '#00AEFF',
              fill: false
            }]
        },
      });

    });
  }

  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }

  loadChart() {
    return 
  }

  anglesLeft = faAnglesLeft;
}
