import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SecurityService } from '../services/auth/security.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {

      //console.log('running auth guard!');

      let isSessionStorageAvailable = typeof sessionStorage !== 'undefined';

      if (isSessionStorageAvailable) {

        const token = sessionStorage.getItem(environment.sessionName);

        if (!token) {
          resolve(false);
          this.router.navigate(['/ingreso']);
        } else {

          const datos = {
            token: token
          };

          this.securityService.validate(datos).subscribe(
            {
              next: (res: any) => {
                //console.log('res', res);
                const estado = res.estado;
                const datos = res.datos;
                if (estado == '1' && datos != null && datos != '') {
                  resolve(true);
                } else {
                  resolve(false);
                  this.router.navigate(['/ingreso']);
                }
              },
              error: error => {
                resolve(false);
                this.router.navigate(['/ingreso']);
              }
            }
          );

        }

      } else {
        resolve(false);
      }

    });
  }

}