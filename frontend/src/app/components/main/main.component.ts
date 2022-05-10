import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { IndexComponent } from '../../index/index.component';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    //this.router.navigate(["home"])
  }

}
