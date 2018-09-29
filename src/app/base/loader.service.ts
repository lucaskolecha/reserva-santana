import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  activeLoader() {
    document.getElementById('bodyLoader').classList.add('loaderBody');
    document.getElementById('loaderAll').style.display = "flex";
    setTimeout(function () {
      document.getElementById('loaderAll').classList.add('active');
    }.bind(this), 10);
    
  }

  removeLoader() {
    document.getElementById('bodyLoader').classList.remove('loaderBody');
    document.getElementById('loaderAll').classList.remove('active');
    setTimeout(function () {
      document.getElementById('loaderAll').style.display = "none";
    }.bind(this), 500);
  }

}
