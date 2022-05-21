import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service.service';
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
    console.log(this.maletas)
    this.getCriptoHistory("btc")
  }  

  onSelectMaleta(id: any): void{
    this.router.navigate(['/maleta', id]);
  }
  
  getMaletas(): void{
    this._maletaService.getMaletas().subscribe(res => {
      this.maletas = res;
      console.log(this.maletas);
    });
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
        labels.push(i)
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
