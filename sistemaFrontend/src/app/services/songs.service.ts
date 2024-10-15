import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

  errorMsg: string | undefined;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem(environment.sessionName)
    })
  }

  constructor(private httpClient: HttpClient) { }

  getCanciones(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/songs/', this.httpOptions)
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

  reproducirCancion(id: number): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/player/', { song_id: id }, this.httpOptions)
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

  setFavorite(song_id: number, favorite: number): Observable<any> {
    return this.httpClient.patch<any>(environment.apiUrl + '/songs/' + song_id + '/favorite', { favorite: favorite }, this.httpOptions)
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
