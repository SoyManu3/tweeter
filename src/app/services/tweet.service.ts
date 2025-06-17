import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class TweetService {
  apiURL = 'https://game-spring.onrender.com/';
  token = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.getSession('token');
    console.log(this.token);
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token, // Asegúrate de que este valor esté correcto
    }),
  };
  errorMessage = '';

  getHttpOptions() {
    const token = this.storageService.getSession('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
  }

  getTweets(): Observable<Tweet> {
    console.log('tweets: ' + this.apiURL + 'api/game/all');
    return this.http
      .get<Tweet>(this.apiURL + 'api/game/all', this.getHttpOptions())
      .pipe(retry(1), catchError(this.handleError));
  }

  postTweet(myTweet: any) {
    const body = {
      nombre: myTweet.nombre,
      creador: myTweet.creador,
      fechaDeLanzamiento: myTweet.fechaDeLanzamiento,
      plataformas: myTweet.plataformas,
      genero: myTweet.genero,
    };
    console.log(body);

    return this.http
      .post(this.apiURL + 'api/game/create', body, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
