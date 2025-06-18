import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { TweetService } from '../services/tweet.service';
import { Tweet } from '../models/tweets/Tweet';
import { InteraccionesService } from '../services/interacciones.service';
import { ComentariosTweet } from '../models/ComentariosPublicacion/ComentariosTweet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  username: string = ''; // Nombre del usuario
  nombre: string = ''; // Contenido del tweet
  creador: string = ''; // Creador del tweet
  fechaDelanzamiento: number = 0; // Año de lanzamiento del juego
  plataformas: string = ''; // Plataformas
  genero: string = ''; // Género
  url: string = 'sin url'; // URL del tweet
  img: string = ''; // Imagen del tweet
  tweets: Tweet[] = []; // Lista de tweets
  commentText: { [key: number]: string } = {}; // Comentarios para cada tweet
  comentarios: { [key: number]: ComentariosTweet[] } = {}; // Comentarios por gameId
  reactionCounts: { [key: number]: { likes: number; dislikes: number } } = {};
  userReactions: { [key: number]: boolean } = {};

  constructor(
    private storageService: StorageService,
    private tweetService: TweetService,
    private interaccionesService: InteraccionesService
  ) {
    this.username = this.storageService.getSession('user');
    console.log(this.username);
  }
  ngOnInit(): void {
    this.getTweets();
  }

  private getTweets() {
    this.tweetService.getTweets().subscribe(
      (tweets: any) => {
        this.tweets = tweets.content; // Asignar los tweets obtenidos
        console.log(this.tweets); // Ver los tweets en la consola

        // Llamamos a los métodos sin esperar que uno termine antes de ejecutar el otro
        this.tweets.forEach((tweet: Tweet) => {
          this.getComentarios(tweet); // Obtener los comentarios de cada tweet
          this.countReactions(tweet.id); // Obtener las reacciones de cada tweet
        });
      },
      (error) => {
        console.error('Error al obtener tweets:', error); // Manejo de errores
      }
    );
  }

  // Método para obtener comentarios
  public getComentarios(tweet: Tweet) {
    this.interaccionesService.getComentariosPorGame(tweet.id).subscribe(
      (comentarios: ComentariosTweet[]) => {
        this.comentarios[tweet.id] = comentarios; // Guardar los comentarios en la propiedad correspondiente
        console.log('Comentarios obtenidos:', comentarios);
      },
      (error) => {
        console.error('Error al obtener comentarios:', error);
      }
    );
  }

  public addTweet() {
    const body = {
      nombre: this.nombre,
      creador: this.creador,
      fechaDeLanzamiento: this.fechaDelanzamiento,
      plataformas: this.plataformas,
      genero: this.genero,
      url: this.url,
      img: this.img,
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

  // Método para agregar un comentario
  public addComentario(tweetId: number) {
    const comentario = this.commentText[tweetId];
    if (!comentario?.trim()) return; // No mandar comentarios vacíos

    // Agregar el comentario al backend
    this.interaccionesService.postComentario(tweetId, comentario).subscribe(
      (res) => {
        console.log('Comentario agregado', res);

        // Recargar los comentarios para este tweet después de agregar uno
        this.getComentarios({ id: tweetId } as Tweet); // Llamar a getComentarios para refrescar
        this.commentText[tweetId] = ''; // Limpiar el input de comentario
      },
      (err) => {
        console.error('Error al agregar comentario:', err);
      }
    );
  }

  // Método para agregar "Like"
  // Método para agregar "Like"
  public addLike(tweetId: number) {
    const idReaction = 1; // 1 para "Me gusta"
    this.interaccionesService
      .hasUserReacted(tweetId, idReaction)
      .subscribe((hasReacted: boolean) => {
        if (hasReacted) {
          console.log('El usuario ya ha reaccionado con Like a este tweet.');
          return; // No agregar la reacción si el usuario ya ha reaccionado
        }

        // Si no ha reaccionado, agregar la reacción
        this.interaccionesService.postReaction(tweetId, idReaction).subscribe(
          (response: any) => {
            console.log('Reacción de Like agregada con éxito', response);

            // Una vez que la reacción ha sido agregada, actualizamos las reacciones
            this.countReactions(tweetId); // Actualizar las reacciones
          },
          (error) => {
            console.error('Error al agregar la reacción:', error);
          }
        );
      });
  }

  // Método para agregar "Dislike"
  public addDisLike(tweetId: number) {
    const idReaction = 2; // 2 para "No me gusta"
    this.interaccionesService
      .hasUserReacted(tweetId, idReaction)
      .subscribe((hasReacted: boolean) => {
        if (hasReacted) {
          console.log('El usuario ya ha reaccionado con Dislike a este tweet.');
          return; // No agregar la reacción si el usuario ya ha reaccionado
        }

        // Si no ha reaccionado, agregar la reacción
        this.interaccionesService.postReaction(tweetId, idReaction).subscribe(
          (response: any) => {
            console.log('Reacción de Dislike agregada con éxito', response);

            // Una vez que la reacción ha sido agregada, actualizamos las reacciones
            this.countReactions(tweetId); // Actualizar las reacciones
          },
          (error) => {
            console.error('Error al agregar la reacción:', error);
          }
        );
      });
  }
  public countReactions(tweetId: number): void {
    this.interaccionesService.countReactions(tweetId).subscribe(
      (reactionCounts) => {
        console.log(
          `Reacciones actualizadas para el tweet ${tweetId}:`,
          reactionCounts
        );
        this.reactionCounts[tweetId] = reactionCounts || {
          likes: 0,
          dislikes: 0,
        };
      },
      (error) => {
        console.error(
          `Error al obtener reacciones para el tweet ${tweetId}:`,
          error
        );
        this.reactionCounts[tweetId] = { likes: 0, dislikes: 0 };
      }
    );
  }
}
