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
  grupo_atual: any;
  saldo_grupo: any;

  chart: any;
  coin_data = [];

  /*
  cryptos: any;
  chart: any;
  btc_data = [null];
  time_data = ['','','',''];
  */

  constructor(private _authService: AuthService,
              private _maletaService: MaletaService,
              private _grupoService: GrupoService,
              private _apiService: ApiService,
              private router: Router) {}

  /*
  ngOnInit(){
    this.chart = document.getElementById('myCanvas');
    Chart.register(...registerables);
    this.refreshData();
    var btc_chart = this.loadChart();

    this.cryptos = setInterval(() => {
      this.refreshData();
      btc_chart.update();
    }, 10000);
  }
  */

  /*
  refreshData(){
    this._data.getPrices().subscribe(res => {
      this.cryptos = res;
      var resp_json = JSON.parse(JSON.stringify(res));
      this.btc_data.push(resp_json.BTC.USD);
      this.time_data.push('');
    });
  }

  loadChart() {
    return new Chart(this.chart, {
      type: 'line',
      data: {
        labels: this.time_data,
        datasets: [
          {
            data: this.btc_data,
            borderColor: '#00AEFF',
            fill: false
          }
        ]
      },
    });
  }
  */

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
      this.calcularSaldoGrupo();
    });
  }

  onSelectGrupo(grupo: any): void{
    //this.grupo_atual = this.grupos.indexOf(grupo);
    //this.calcularSaldoGrupo();
    this.router.navigate(['grupo',grupo.name])
  }

  onDeleteGrupo(grupo: any): void{
    this._grupoService.removeGrupo(grupo._id).subscribe(res => {
      this.grupos = res;
      this.grupo_atual = 0;
    });
  }

  getMaletas(): void{
    this._maletaService.getMaletas().subscribe(res => {
      this.maletas = res;
      console.log(this.maletas);
    });
  }

  getGrupos(): void{
    this._grupoService.getGrupos().subscribe(res => {
      this.grupos = res;
      if(this.grupos.length > 0){
        this.grupo_atual = 0;
        this.calcularSaldoGrupo();
      }
      console.log(this.grupos);
    });
  }

  calcularSaldoGrupo(): void{
    var saldo = 0;

    for(var i=0; i<this.grupos[this.grupo_atual].maletas.length; i++){
      for(var j=0; j<this.maletas.length; j++){
        if(this.grupos[this.grupo_atual].maletas[i] === this.maletas[j]._id){
          saldo += this.maletas[j].value
          break;
        }
      }
    }

    console.log(saldo)
    this.saldo_grupo = saldo;
  }

  getCriptoPrice(cripto: any): void{
    this._apiService.getCriptoPrice(cripto).subscribe(res => {
      console.log(res)
    })
  }

  getCriptoHistory(cripto: any): void{
    this._apiService.getCriptoHistory(cripto).subscribe(res => {

      var resp_json = JSON.parse(JSON.stringify(res));

      console.log(resp_json)

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
    })
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
