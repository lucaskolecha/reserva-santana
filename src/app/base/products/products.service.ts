import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { Router } from '@angular/router';
import { Constants } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private db;
  private uidLogged = sessionStorage.getItem('tokenUid');

  constructor(private router: Router) {
    this.db = firestore();
    this.db.settings({ timestampsInSnapshots: true });
  }

  getOne(uid) {
    let one = [];
    return new Promise((response) => {
      this.db.collection(Constants.COLLECTION_COMPANIES).doc(this.uidLogged)
        .collection(Constants.COLLECTION_PRODUCTS).doc(uid).get().then((documents) => {
          if (documents.exists) {
            one.push(documents.data());
            response(one);
          } else {
            response(one);
          }
        });
    });
  }

  getAll() {
    let all = [];
    return new Promise((response) => {
      this.db.collection(Constants.COLLECTION_COMPANIES).doc(this.uidLogged)
        .collection(Constants.COLLECTION_PRODUCTS).get().then((documents) => {
          documents.forEach(function (doc) {
            let item = {
              name: doc.data().name,
              category: doc.data().category,
              price: doc.data().price,
              uid: doc.id
            }
            all.push(item);
          });
          response(all);
        });
    });
  }

  saveProducts(uid, entity) {
    return new Promise((response, rej) => {
      if (uid) {
        this.db.collection(Constants.COLLECTION_COMPANIES).doc(this.uidLogged)
          .collection(Constants.COLLECTION_PRODUCTS).doc(uid).update(entity).then((data) => {
            response(data);
            this.router.navigate(['/app/products']);
          }).catch((error) => {
            rej(error)
          });
      } else {
        this.db.collection(Constants.COLLECTION_COMPANIES).doc(this.uidLogged)
          .collection(Constants.COLLECTION_PRODUCTS).doc().set(entity).then((data) => {
            response(data);
            this.router.navigate(['/app/products']);
          }).catch((error) => {
            rej(error)
          });;
      }
    });
  }

  removeProducts(uid) {
    return new Promise((response) => {
      this.db.collection(Constants.COLLECTION_COMPANIES).doc(this.uidLogged)
          .collection(Constants.COLLECTION_PRODUCTS).doc(uid).delete().then((data) => {
        response(data);
      });
    });
  }
}
