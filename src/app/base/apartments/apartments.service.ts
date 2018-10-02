import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApartmentsService {

  private db;

  private KEY_API = 'AIzaSyDpApjwuc0xauomIxlTDaoxGnqYGEjwVpE';
  private BASE_API = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';

  constructor(private router: Router, private http: HttpClient) {
    this.db = firestore();
    this.db.settings({ timestampsInSnapshots: true });
  }

  transformInPromise(observer) {
    return new Promise((resolve, reject) => observer.subscribe(resolve, reject));
  }

  async getIdTokenByEmailAndPassword(email, password) {
    const observer = this.http.post(`${this.BASE_API}/verifyPassword?key=${this.KEY_API}`, {
      email,
      password,
    });
    const data: any = await this.transformInPromise(observer);
    return data.idToken;
  }

  async getIdToken(uid): Promise<any> {
    const apartments: any = await this.getOne(uid);
    return await this.getIdTokenByEmailAndPassword(apartments.email, apartments.password);
  }

  async deleteUser(uid) {
    const idToken = await this.getIdToken(uid);
    await this.db.collection(Constants.COLLECTION_APARTMENTS).doc(uid).delete();
    return await this.transformInPromise(this.http.post(`${this.BASE_API}/deleteAccount?key=${this.KEY_API}`, { idToken }));
  }

  async saveUserAuth(user: { email: string, password: string, displayName: string }) {
    return await this.transformInPromise(this.http.post(`${this.BASE_API}/setAccountInfo?key=${this.KEY_API}`, user));
  }

  async editUserAuth(oldUser: { email: string, password: string, displayName: string }, user: { email: string, password: string, displayName: string }) {
    const idToken = await this.getIdTokenByEmailAndPassword(oldUser.email, oldUser.password);
    return await this.transformInPromise(this.http.post(`${this.BASE_API}/setAccountInfo?key=${this.KEY_API}`, Object.assign(user, { idToken })));
  }

  async getOne(uid) {
    return new Promise((response) => {
      this.db.collection(Constants.COLLECTION_APARTMENTS).doc(uid).get().then((documents) => {
        if (documents.exists) {
          response(documents.data());
        } else {
          response(null);
        }
      });
    });
  }

  getAll() {
    let all = [];
    return new Promise((response) => {
      this.db.collection(Constants.COLLECTION_APARTMENTS).get().then((documents) => {
        documents.forEach(function (doc) {
          let item = {
            number: doc.data().number,
            person: doc.data().person,
            email: doc.data().email,
            password: doc.data().password,
            uid: doc.id
          }
          all.push(item);
        });
        response(all);
      });
    });
  }

  saveApartments(uid, entity, oldEntity) {
    return new Promise((response, reject) => {
      if (uid) {
        this.editUserAuth(oldEntity, entity).then(() => {
          this.db.collection(Constants.COLLECTION_APARTMENTS).doc(uid).update(entity).then(() => {
            this.router.navigate(['/app/apartments']);
            response(entity);
          });
        }).catch((err) => {
          reject(err.error.error);
        });
      } else {
        this.saveUserAuth(entity).then(() => {
          this.db.collection(Constants.COLLECTION_APARTMENTS).doc().set(entity).then(() => {
            this.router.navigate(['/app/apartments']);
            response(entity);
          });
        }).catch((err) => {
          console.error(err);
          reject(err.error.error);
        });
      }
    });
  }
}
