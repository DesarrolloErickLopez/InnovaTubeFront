import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from "rxjs/operators";
import { environment } from '../../../assets/enviroments';
 
@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {
  }

  getTokenClientModule(token: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    const payload = { token }; 

    return this.http.post<any>(`${this.apiUrl}/login/verificar`, payload, httpOptions)
      .pipe(
        catchError((err) => {
          console.log('error caught in service');
          console.error(err);
          return throwError(err);
        })
      );
  }
}