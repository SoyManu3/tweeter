import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Credential } from '../models/user/Credential';
import { Router } from '@angular/router';
import { Token } from '../models/user/Token';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {}

  email: String = '';
  password: String = '';
  myLogin = new Token();

  callLogin() {
    var myCredential = new Credential();

    myCredential.email = this.email;
    myCredential.password = this.password;

    this.userService.postLogin(myCredential).subscribe(
      (data: any) => {
        console.log('user logged: ', JSON.stringify(data));
        this.storageService.setSession('user', myCredential.email);
        console.log('Token : ' + JSON.parse(JSON.stringify(data)).accessToken);

        this.storageService.setSession(
          'token',
          JSON.parse(JSON.stringify(data)).accessToken
        );

        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error de inicio de sesión: ', error);

        // Muestra un mensaje de error personalizado dependiendo de la respuesta
        if (error.status === 400) {
          alert(
            'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.'
          );
        } else if (error.status === 500) {
          alert(
            'Error en el servidor. Por favor, intenta nuevamente más tarde.'
          );
        } else {
          alert(
            'Hubo un error al intentar iniciar sesión. Inténtalo de nuevo.'
          );
        }

        // Limpiar campos después de un error
        this.email = '';
        this.password = '';
      }
    );
  }
}
