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
  public uid: any;
  public rePassword: string;
  public cropConfig: any;
  public loaderBtn = true;

  public entity: any = {
    image: 'assets/images/logo.png'
  };

  public oldEntity: any = {
    image: 'assets/images/logo.png'
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
          console.error(e);
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

  validadePassword() {
    let resp: boolean;
    if (!this.uid) {
      resp = this.as.verifyPassword(this.entity.password, this.rePassword);
      if (!resp) {
        this.entity.password = '';
        this.rePassword = '';
        document.getElementById('password').focus();
      }
      return resp;
    }
  }

  disableButton() {
    if (this.uid) {
      if (!this.entity.name ||
        !this.entity.email) {
        return true;
      }
    } else {
      if (!this.entity.name ||
        !this.entity.email ||
        !this.entity.password ||
        !this.rePassword ) {
        return true;
      }
    }
    return false;
  }

  saveCompany() {
    if (!this.uid && !this.validadePassword()) {
      this.notif.notify('error', 'Campo Senha e Repetir Senha estão diferentes.');
      return;
    }
    this.loaderBtn = false;
    if (this.entity.image != 'assets/images/logo.png') {
      this.storageService.upload(this.entity.image, 'company').then((urlImage) => {
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
      this.loaderBtn = true;
    });
  }

}
