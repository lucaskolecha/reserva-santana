import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

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
    const company: any = await this.getOne(uid);
    return await this.getIdTokenByEmailAndPassword(company.email, company.password);
  }

  async deleteUser(uid) {
    const idToken = await this.getIdToken(uid);
    await this.db.collection(Constants.COLLECTION_COMPANIES).doc(uid).delete();
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
      this.db.collection(Constants.COLLECTION_COMPANIES).doc(uid).get().then((documents) => {
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
      this.db.collection(Constants.COLLECTION_COMPANIES).get().then((documents) => {
        documents.forEach(function (doc) {
          let item = {
            name: doc.data().name,
            phone: doc.data().phone,
            email: doc.data().email,
            uid: doc.id
          }
          all.push(item);
        });
        response(all);
      });
    });
  }

  saveCompany(uid, entity, oldEntity) {
    return new Promise((response, reject) => {
      if (uid) {
        if (entity.password) {
          this.editUserAuth(oldEntity, entity).then(() => {
            this.db.collection(Constants.COLLECTION_COMPANIES).doc(uid).update(entity).then(() => {
              response(entity)
            })
          }).catch((err) => {
            reject(err.error.error)
          })
        } else {
          this.db.collection(Constants.COLLECTION_COMPANIES).doc(uid).update(entity).then(() => {
            response(entity)
          })
        }
      } else {
        this.saveUserAuth(entity).then(() => {
          this.db.collection(Constants.COLLECTION_COMPANIES).doc().set(entity).then(() => {
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
