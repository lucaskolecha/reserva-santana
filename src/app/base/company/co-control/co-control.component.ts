import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-co-control',
  templateUrl: './co-control.component.html',
  styleUrls: ['./co-control.component.scss']
})
export class CoControlComponent implements OnInit {
  private uid: any;

  private image: any;

  private entity: any = {
    name: null,
    phone: null,
    open: null,
    close: null,
    email: null,
    password: null
  };

  private oldEntity: any = {
    name: null,
    phone: null,
    open: null,
    close: null,
    email: null,
    password: null
  };

  constructor(private activatedRoute: ActivatedRoute, private coService: CompanyService, private router: Router, private as: AuthService, private notif: NotifierService) {
    this.image = { foto : 'assets/images/upload.png'};
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.uid) {
        this.coService.getOne(params.uid).then((resp) => {
          if (resp) {
            this.entity = resp;
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

  }

  goBack() {
    this.router.navigate(['/app/company']);
  }

  saveCompany() {
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
