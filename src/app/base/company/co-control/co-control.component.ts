import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../auth/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-co-control',
  templateUrl: './co-control.component.html',
  styleUrls: ['./co-control.component.scss']
})
export class CoControlComponent implements OnInit {
  private uid: any;
  private cropConfig: any;

  private entity: any = {
    name: null,
    phone: null,
    open: null,
    close: null,
    email: null,
    password: null,
    image: 'assets/images/logo.jpeg'
  };

  private oldEntity: any = {
    name: null,
    phone: null,
    open: null,
    close: null,
    email: null,
    password: null,
    image: 'assets/images/logo.jpeg'
  };

  constructor(private storageService: StorageService, private activatedRoute: ActivatedRoute, private coService: CompanyService, private router: Router, private as: AuthService, private notif: NotifierService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.uid) {
        this.coService.getOne(params.uid).then((resp: any) => {
          if (resp) {
            this.entity.name = resp.name || null;
            this.entity.phone = resp.phone || null;
            this.entity.open = resp.open || null;
            this.entity.close = resp.close || null;
            this.entity.email = resp.email || null;
            this.entity.password = resp.password || null;
            this.entity.image = resp.image || 'assets/images/logo.jpeg';
            this.oldEntity = Object.assign({}, this.entity);
            this.uid = params.uid;
          } else {
            this.router.navigate(['/app/company']);
          }
        }).catch((e) => {
          console.log(e);
        });
      }
    });
  }

  ngOnInit() {
    this.cropConfig = {
      viewport: {
        width: 250,
        height: 250
      }
    }
  }

  goBack() {
    this.router.navigate(['/app/company']);
  }

  saveCompany() {
    if (this.entity.image != 'assets/images/logo.jpeg') {
      this.storageService.upload(this.entity.image).then((urlImage) => {
        this.entity.image = urlImage;
      });
    }
    this.coService.saveCompany(this.uid, this.entity, this.oldEntity).then(() => {
      if (this.uid) {
        this.notif.notify('success', 'Uhull, empresa alterada com sucesso!!!');
      } else {
        this.notif.notify('success', 'Uhull, empresa cadastrada com sucesso!!!');
      }
    }).catch((err) => {
      this.as.translateError(err);
    });
  }

}
