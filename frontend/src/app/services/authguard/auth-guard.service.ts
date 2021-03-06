import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild {

  authenticated: any

  constructor(private router: Router,
    private _authService: AuthService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const auth = await this._authService.isLogged();

    if(auth){
      return true;
    }
    
    this.router.navigate(['login']);
    return false;
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const auth = await this._authService.isLogged();

    if(auth){
      return true;
    }
    
    this.router.navigate(['login']);
    return false;
  }
  
}
