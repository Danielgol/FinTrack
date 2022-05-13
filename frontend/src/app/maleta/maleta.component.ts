import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaletaService } from '../services/maleta/maleta-service.service';

@Component({
  selector: 'app-maleta',
  templateUrl: './maleta.component.html',
  styleUrls: ['./maleta.component.css']
})
export class MaletaComponent implements OnInit {

  maleta: any;
  
  constructor(private router: ActivatedRoute,
              private _maletaservice: MaletaService) { }

  ngOnInit(): void {
    const name = this.router.snapshot.paramMap.get('id');
    this.getMaletaInfo(name)
  }

  getMaletaInfo(name: any): void{
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    const maleta = this._maletaservice.getMaletaByName({'email': email, 'token': token, 'name': name}).subscribe(
      res => {
        this.maleta = res;
        console.log(this.maleta);
    }, error => {
      console.log("Maleta não foi criada!")
    });
  }

}
