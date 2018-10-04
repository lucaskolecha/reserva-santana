import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Constants } from '../constants';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public typeUser;
  private db;

  constructor(private fire: AngularFireAuth, private router: Router, private notif: NotifierService) {
    this.db = firestore();
    this.db.settings({ timestampsInSnapshots: true });
  }

  getUserLogged() {
    return new Promise((resp, rej) => {
      this.fire.auth.onAuthStateChanged(function (user) {
        resp(user);
      })
    });
  }

  isLoggedIn(): Promise<boolean> {
    const typeU = sessionStorage.getItem('typeUser');
    return this.getUserLogged().then(resp => {
      if (resp != null) {
        return true;
      }
      sessionStorage.clear();
      return false;
    });
  }

  searchSyndicateByUid(user) {
    return new Promise((response) => {
      this.db.collection(Constants.COLLECTION_SYNDICATES).where('uid', '==', user.uid).get().then((documents) => {
        if (documents.docs.length > 0) {
          if (documents.docs && documents.docs[0].exists) {
            this.typeUser = 'SYNDICATE';
            response(documents.docs[0].data());
          }
        } else {
          response(null);
        }
      });
    });
  }

  searchCompaniesByEmail(user) {
    return new Promise((response) => {
      this.db.collection(Constants.COLLECTION_COMPANIES).where('email', '==', user.email).get().then((documents) => {
        if (documents.docs.length > 0) {
          response(documents);
        } else {
          response(null);
        }
      });
    });
  }

  identifyUser(user: Object) {
    return new Promise((response, reject) => {
      this.searchSyndicateByUid(user).then((syndicate) => {
        if (syndicate) {
          this.typeUser = 'SYNDICATE';
          sessionStorage.setItem('typeUser', this.typeUser);
          response(syndicate);
        } else {
          this.searchCompaniesByEmail(user).then((company) => {
            if (company) {
              this.typeUser = 'COMPANY';
              sessionStorage.setItem('typeUser', this.typeUser);
              response(company);
            } else {
              reject(true);
            }
          });
        }
      });
    });
  }

  signIn(email: string, password: string) {
    return new Promise((response, reject) => {
      this.fire.auth.signInWithEmailAndPassword(email, password).then(() => {
        this.fire.authState.subscribe(user => {
          if (user) {
            this.identifyUser(user).then((resp) => {
              sessionStorage.setItem('tokenUid', user.uid);
              this.router.navigate(['/app/home']);
              response(resp);
            }).catch(() => {
              const err = { code: 'PERMISSION_DENIED' };
              reject(err);
            });
          }
        });
      }).catch(err => {
        reject(err);
      })
    });
  }

  logOut() {
    this.fire.auth.signOut()
      .then(() => {
        sessionStorage.clear();
        this.router.navigate(['login']);
      })
      .catch(err => {
        console.error(err);
      })
  }

  verifyPassword(pass, rePass) {
    return pass === rePass;
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

  translateLoginError() {
    return 'Credenciais inválidas';
  }
}
