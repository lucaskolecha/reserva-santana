import { Injectable } from '@angular/core';
import { storage } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  uid() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = '';
    for (let i = 0; i < 36; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) };
    return text.toUpperCase();
  }

  public upload(base64: string, type: string) {
    return new Promise((res, rej) => {
      const storageRef = storage().ref().child(type + '-' + this.uid())
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
