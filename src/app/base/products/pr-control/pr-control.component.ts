import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-pr-control',
  templateUrl: './pr-control.component.html',
  styleUrls: ['./pr-control.component.scss']
})
export class PrControlComponent implements OnInit {
  private uid: any
  public loaderBtn = true
  public categories: Array<Object>
  public opts: boolean = false
  public options: Array<Object>

  private entity: any = {
    image: 'assets/images/logo.png'
  };

  constructor(private activatedRoute: ActivatedRoute, private prService: ProductsService, private router: Router, private storageService: StorageService) {
    let array = <any>[];
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.uid) {
        this.prService.getOne(params.uid).then((resp) => {
          array = resp;
          if (array.length > 0) {
            this.entity = resp[0];
            this.uid = params.uid;
          } else {
            this.router.navigate(['/app/products']);
          }
        }).catch((e) => {
          console.error(e);
        });
      }
    });
  }

  ngOnInit() {
    this.getCategories().then((resp: Array<Object>) => {
      this.categories = resp;
    });
  }

  goBack() {
    this.router.navigate(['/app/products']);
  }

  disableButton() {
    if (!this.entity.name ||
      !this.entity.category ||
      !this.entity.price) {
      return true;
    }
    return false;
  }

  getCategories(): Promise<Array<Object>> {
    return new Promise((response) => {
      return this.prService.getCategories().then((categories: Array<Object>) => {
        response(categories);
      });
    });
  }

  setCategory(category) {
    this.entity.category = category;
  }

  toggleOtions() {
    setTimeout(function () {
      this.opts = !this.opts;
    }.bind(this), 100);
  }

  keyPressOptions(param) {
    if (param) {
      this.getSearch(param).then((arr: Array<Object>) => {
        this.options = this.removeEquals(arr, 'category');
      });
    }
  }

  getSearch(param) {
    return new Promise((resolve) => {
      var arr = this.categories.filter(function (item: any) {
        return item.category.toLowerCase().indexOf(param.toLowerCase()) != -1;
      })
      resolve(arr);
    })
  };

  removeEquals(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  saveProduct() {
    this.loaderBtn = false;
    if (this.entity.image != 'assets/images/logo.png') {
      this.storageService.upload(this.entity.image, 'product').then((urlImage) => {
        this.entity.image = urlImage;
      });
    }
    this.prService.saveProducts(this.uid, this.entity).then(() => {
    });
  }

}
