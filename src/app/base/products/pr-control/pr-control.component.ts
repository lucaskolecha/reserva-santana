import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-pr-control',
  templateUrl: './pr-control.component.html',
  styleUrls: ['./pr-control.component.scss']
})
export class PrControlComponent implements OnInit {
  private uid: any;

  private entity = {
    name: null,
    category: null,
    price: null,
    image: 'assets/images/logo.jpeg'
  };

  constructor(private activatedRoute: ActivatedRoute, private prService: ProductsService, private router: Router) {
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
          console.log(e);
        });
      }
    });
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/app/products']);
  }

  saveProduct() {
    this.prService.saveProducts(this.uid, this.entity).then(() => {
    });
  }

}
