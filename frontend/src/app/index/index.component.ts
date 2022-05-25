import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  hasToken: any;

  constructor() { }

  ngOnInit(): void {
    this.hasToken = !!localStorage.getItem('token')
  }

}
