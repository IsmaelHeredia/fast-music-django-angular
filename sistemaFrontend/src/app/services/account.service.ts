import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

interface DatosToken {
  token: any;
}

interface DatosCuenta {
  username: string;
  new_username: string;
  password: string;
  new_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  errorMsg: string | undefined;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem(environment.sessionName)
    })
  }

  constructor(private httpClient: HttpClient) { }

  getDatos(): Observable<any> {

    const datos = {
      token: sessionStorage.getItem(environment.sessionName)
    }

    return this.httpClient.post<any>(environment.apiUrl + '/validate/', JSON.stringify(datos), this.httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            this.errorMsg = `Error: ${error.error.message}`;
          } else {
            this.errorMsg = this.getServerErrorMessage(error);
          }

          return throwError(() => this.errorMsg);
        })
      )
  }

  postCambios(datos: DatosCuenta): Observable<DatosCuenta> {
    return this.httpClient.post<DatosCuenta>(environment.apiUrl + '/account/', JSON.stringify(datos), this.httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            this.errorMsg = `Error: ${error.error.message}`;
          } else {
            this.errorMsg = this.getServerErrorMessage(error);
          }

          return throwError(() => this.errorMsg);
        })
      )
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }

    }
  }

}
