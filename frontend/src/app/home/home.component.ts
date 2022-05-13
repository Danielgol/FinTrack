import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service.service';
import { MaletaService } from '../services/maleta/maleta-service.service';
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
  coin_data = [1.0, 5.4, 3.2, 9.5, 7.3, 4.2];

  /*
  cryptos: any;
  chart: any;
  btc_data = [null];
  time_data = ['','','',''];
  */




  constructor(private _authService: AuthService,
              private _maletaService: MaletaService,
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



  ngOnInit(): void {
    this.getMaletas();
    console.log(this.maletas)

    Chart.register(...registerables);
    this.chart = new Chart("myChart", {
      type: 'line',
      data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            data: this.coin_data,
            borderColor: '#00AEFF',
            fill: false
          }]
      },
    });


  }

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

  onSelectMaleta(id: any): void{
    this.router.navigate(['/maleta', id]);
  }
  
  getMaletas(): void{
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    this._maletaService.getMaletas({'email': email, 'token': token}).subscribe(res => {
      this.maletas = res;
      console.log(this.maletas);
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
