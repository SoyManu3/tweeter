import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { InteraccionesService } from '../services/interacciones.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  username: string = ''; // Nombre del usuario
  nombre: string = ''; // Contenido del tweet
  creador: string = ''; // Creador del juego
  fechaDelanzamiento: number = 0; // Año de lanzamiento del juego
  plataformas: string = ''; // Plataformas
  genero: string = ''; // Género
  tweets: Tweet[] = []; // Lista de tweets
  commentText: { [key: number]: string } = {}; // Comentarios para cada tweet

  constructor(
    private storageService: StorageService,
    private tweetService: TweetService,
    private interaccionesService: InteraccionesService
  ) {
    this.username = this.storageService.getSession('user');
    console.log(this.username);
    this.getTweets(); // Obtener los tweets existentes
  }

  private getTweets() {
    this.tweetService.getTweets().subscribe((tweets: any) => {
      this.tweets = tweets.content; // Asignar los tweets obtenidos
      console.log(this.tweets); // Ver los tweets en la consola
    });
  }

  public addTweet() {
    const body = {
      nombre: this.nombre,
      creador: this.creador,
      fechaDeLanzamiento: this.fechaDelanzamiento,
      plataformas: this.plataformas,
      genero: this.genero,
    };

    console.log('Enviando tweet:', body);

    this.tweetService.postTweet(body).subscribe(
      (response: any) => {
        console.log('Tweet agregado con éxito', response);
        this.nombre = ''; // Limpiar el formulario
        this.creador = '';
        this.fechaDelanzamiento = 0;
        this.plataformas = '';
        this.genero = '';
        this.getTweets(); // Actualizar la lista de tweets
      },
      (error) => {
        console.error('Error al agregar el tweet:', error); // Manejo de errores
      }
    );
  }

  public addLike(idVideojuego: number) {
    const idReaction = 1; // Asignamos 1 al parámetro idReaction

    this.interaccionesService.postReaction(idVideojuego, idReaction).subscribe(
      (response: any) => {
        console.log('Reacción agregada con éxito', response);
      },
      (error) => {
        console.error('Error al agregar la reacción:', error);
      }
    );
  }

  public addDisLike(idVideojuego: number) {
    const idReaction = 2; // Asignamos 2 al parámetro idReaction

    this.interaccionesService.postReaction(idVideojuego, idReaction).subscribe(
      (response: any) => {
        console.log('Reacción agregada con éxito', response);
      },
      (error) => {
        console.error('Error al agregar la reacción:', error);
      }
    );
  }

  // Método para agregar un comentario
  public addComentario(idVideojuego: number) {
    const comentario = this.commentText[idVideojuego];
    if (!comentario?.trim()) return; // no mandar comentarios vacíos

    this.interaccionesService
      .postComentario(idVideojuego, comentario)
      .subscribe(
        (res) => {
          console.log('Comentario agregado', res);
          this.commentText[idVideojuego] = ''; // Limpiar el input de comentario
        },
        (err) => {
          console.error('Error al agregar comentario:', err);
        }
      );
  }
}
