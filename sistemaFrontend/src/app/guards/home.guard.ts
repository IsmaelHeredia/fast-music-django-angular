import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SecurityService } from '../services/auth/security.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {

      //console.log('running home guard!');

      let isSessionStorageAvailable = typeof sessionStorage !== 'undefined';

      if (isSessionStorageAvailable) {

        const token = sessionStorage.getItem(environment.sessionName);

        if (!token) {
          resolve(true);
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
                  resolve(false);
                  this.router.navigate(['/player/home']);
                } else {
                  resolve(true);
                }
              },
              error: error => {
                resolve(true);
              }
            }
          );

        }

      } else {
        resolve(true);
      }

    });
  }
}