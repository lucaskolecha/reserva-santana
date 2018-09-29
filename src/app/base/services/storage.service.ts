import { Injectable } from '@angular/core';
import { firestore } from 'firebase';
import { storage } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  public upload(base64: string) {
    return new Promise((res, rej) => {
      const storageRef = storage().ref().child('picture.png')
      storageRef.putString(base64, 'data_url').then((response) => {
        response.ref.getDownloadURL().then((downloadUrl) => {
          res(downloadUrl);
        });
      }).catch((err) => {
        console.error(err);
        rej(err);
      });
    })
  }

}
