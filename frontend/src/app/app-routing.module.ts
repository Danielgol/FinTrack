import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { CreateGrupoComponent } from './create-grupo/create-grupo.component';
import { CreateMaletaComponent } from './create-maleta/create-maleta.component';

import { MainComponent } from './components/main/main.component';


const routes: Routes = [
  
  // Utilizar CanActivate para decidir se é a tela index ou homepages
  {path: "", component: IndexComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  
  {
    path: "",
    component: MainComponent,
    children:[
      {path: "home", component: HomeComponent},
      {path: "createGrupo", component: CreateGrupoComponent},
      {path: "createMaleta", component: CreateMaletaComponent},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
