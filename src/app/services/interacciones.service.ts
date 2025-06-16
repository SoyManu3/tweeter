import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InteraccionesService {
  apiURL = 'http://localhost:8080/';
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

  postReaction(idVideojuego: number, idReaction: number) {
    const body = {
      videojuegoId: idVideojuego,
      reactionId: idReaction,
    };
    console.log(body);

    return this.http
      .post(this.apiURL + 'api/reactions/create', body, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  postComentario(idVideojuego: number, comentario: string) {
    const body = {
      videojuegoId: idVideojuego,
      comentario: comentario,
    };
    console.log(body);

    return this.http
      .post(this.apiURL + 'api/comentario/create', body, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

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
