import { Injectable } from '@angular/core';
import { Tweet } from '../models/tweets/Tweet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  apiURL = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtb2QiLCJpYXQiOjE3NDg0NzIyNjcsImV4cCI6MTc0ODU1ODY2N30.ecpmuSQ1qszBYd2j0ZW0Uqx5UmNOW581Sl1j1zgq0og',
    }),
  };
  errorMessage = '';

  getTweets(): Observable<Tweet> {
    console.log('tweets: ' + this.apiURL + 'api/tweets/all');
    return this.http
      .get<Tweet>(this.apiURL + 'api/tweets/all', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  postTweet(myTweet: String) {
    const body = {
      tweet: myTweet,
    };
    console.log(body);

    return this.http
      .post(this.apiURL + 'api/tweets/create', body, this.httpOptions)
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
