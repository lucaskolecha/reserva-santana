import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fire: AngularFireAuth, private router: Router, private notif: NotifierService) {

  }

  sendToken() {

  }

  getToken() {

  }

  getUserLogged() {
    return new Promise((resp, rej) => {
      this.fire.auth.onAuthStateChanged(function (user) {
        resp(user);
      })
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.getUserLogged().then(resp => {
      if (resp != null) {
        return true;
      }
      return false;
    });
  }

  signIn(email: string, password: any) {
    this.fire.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.fire.authState.subscribe(user => {
          console.log(user);
          if (user) {
            localStorage.setItem('tokenUid', user.uid);
            this.router.navigate(['/app/home']);
          }
        });

      })
      .catch(err => {
        console.log('error', err);
      })
  }

  logOut() {
    this.fire.auth.signOut()
      .then(() => {
        localStorage.clear();
        this.router.navigate(['']);
      })
      .catch(err => {
        console.log(err);
      })
  }

  translateError(err) {
    if (err.message == 'EMAIL_EXISTS') {
      this.notif.notify('error', 'E-mail ja está em uso.');
    } else if (err.message == 'INVALID_EMAIL') {
      this.notif.notify('error', 'E-mail não é valido.');
    } else if (err.message == 'WEAK_PASSWORD : Password should be at least 6 characters') {
      this.notif.notify('error', 'Senha deve conter mais de 6 caracteres.');
    } else if (err.message == 'MISSING_PASSWORD') {
      this.notif.notify('error', 'Senha obrigatória.');
    } else if (err.message == 'MISSING_EMAIL') {
      this.notif.notify('error', 'E-mail obrigatório.');
    }
  }

}
