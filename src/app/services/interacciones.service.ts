import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ComentariosTweet } from '../models/ComentariosPublicacion/ComentariosTweet';

@Injectable({
  providedIn: 'root',
})
export class InteraccionesService {
  apiURL = 'https://game-spring-img.onrender.com/';
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

  getComentariosPorGame(gameid: number): Observable<ComentariosTweet[]> {
    return this.http
      .get<ComentariosTweet[]>(
        this.apiURL + `api/comentario/game/` + gameid,
        this.getHttpOptions()
      )
      .pipe(
        tap((comentarios: ComentariosTweet[]) => {
          // Aquí puedes ver los comentarios que devuelve la API
          console.log('Comentarios obtenidos:', comentarios);
        }),
        catchError(this.handleError)
      );
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

  countReactions(
    videoJuegoId: number
  ): Observable<{ likes: number; dislikes: number }> {
    return this.http
      .get<{ likes: number; dislikes: number }>(
        `${this.apiURL}api/reactions/count/${videoJuegoId}`,
        this.getHttpOptions()
      )
      .pipe(
        tap((response) => {
          console.log(
            'Reacciones recibidas para el videojuego ' + videoJuegoId,
            response
          );
        })
      );
  }

  // Método para verificar si el usuario ha reaccionado
  hasUserReacted(
    videoJuegoId: number,
    reactionId: number
  ): Observable<boolean> {
    return this.http
      .get<boolean>(
        `${this.apiURL}api/reactions/exists/${videoJuegoId}/${reactionId}`,
        this.getHttpOptions()
      )
      .pipe(
        tap((response) => {
          console.log(
            `¿Usuario reaccionó al videojuego ${videoJuegoId} con reacción ${reactionId}?`,
            response
          );
        })
      );
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
