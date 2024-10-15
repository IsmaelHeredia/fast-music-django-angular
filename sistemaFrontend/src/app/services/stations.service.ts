import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

interface DatosEstacion {
  name: string;
  link: string;
  categories: string;
}

interface DatosImportacion {
  jsonfile: any;
}

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  errorMsg: string | undefined;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem(environment.sessionName)
    })
  }

  httpOptionsUpload = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem(environment.sessionName)
    })
  }

  constructor(private httpClient: HttpClient) { }

  getStations(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/stations/', this.httpOptions)
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

  getStation(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/stations/' + id, this.httpOptions)
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

  postStation(datos: DatosEstacion): Observable<DatosEstacion> {
    return this.httpClient.post<DatosEstacion>(environment.apiUrl + '/stations/', JSON.stringify(datos), this.httpOptions)
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

  putStation(id: number, datos: DatosEstacion): Observable<DatosEstacion> {
    return this.httpClient.patch<DatosEstacion>(environment.apiUrl + '/stations/' + id, JSON.stringify(datos), this.httpOptions)
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

  deleteStation(id: number): Observable<any> {
    return this.httpClient.delete<any>(environment.apiUrl + '/stations/' + id, this.httpOptions)
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

  postImport(datos: DatosImportacion): Observable<DatosImportacion> {

    let formData = new FormData();
    formData.append('jsonfile', datos.jsonfile);

    return this.httpClient.post<DatosImportacion>(environment.apiUrl + '/stations/import', formData, this.httpOptionsUpload)
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

  getValidate(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/stations/validate', this.httpOptions)
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
