import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { CreateGrupoComponent } from './create-grupo/create-grupo.component';
import { CreateMaletaComponent } from './create-maleta/create-maleta.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './services/authguard/auth-guard.service';
import { MaletaComponent } from './maleta/maleta.component';
import { PageNotFoundComponent } from './components/notfound/notfound.component';
import { GrupoComponent } from './grupo/grupo.component';


const routes: Routes = [

  {path: "", component: IndexComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  
  {
    path: "",
    component: MainComponent,
    canActivateChild: [ AuthGuard ],
    children:[
      {path: "home", component: HomeComponent},
      {path: "createGrupo", component: CreateGrupoComponent},
      {path: "createMaleta", component: CreateMaletaComponent},
      {path: "maleta/:id", component: MaletaComponent},
      {path: "grupo/:id", component: GrupoComponent},
      {path: '**', component: PageNotFoundComponent}
    ],
  },

  {path: '**', component: PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
