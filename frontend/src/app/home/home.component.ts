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
  eth_current: any;

  chart: any;
  btc_data: any;
  eth_data: any;
  shown_data: any;

  cripto_atual: any;

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

      this.cripto_atual = "BTC";

      this.btc_current = resp_json[0].current_price;
      this.btc_data = resp_json[0].sparkline_in_7d.price;

      this.eth_current = resp_json[1].current_price;
      this.eth_data = resp_json[1].sparkline_in_7d.price;

      this.shown_data = this.btc_data;

      Chart.register(...registerables);
      this.chart = this.loadChart();

    });
  }

  loadChart(): any{
    var labels = []
    for(var i=0; i<this.shown_data.length; i++){
      labels.push("")
    }

    return new Chart("myChart", {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
            data: this.shown_data,
            borderColor: '#00AEFF',
            fill: false
          }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              filter: (legendItem, data) => (typeof legendItem.text !== 'undefined')
            }
          }
        }
      }
    });
  }

  changeCripto(): void{
    if(this.cripto_atual === "BTC"){
      this.cripto_atual = "ETH";
      this.shown_data = this.eth_data;
    }else{
      this.cripto_atual = "BTC";
      this.shown_data = this.btc_data;
    }
    this.chart.destroy();
    this.chart = this.loadChart();
  }

  logout(): void{
    this._authService.logout();
    this.router.navigate(['/']);
  }

  anglesLeft = faAnglesLeft;
}
