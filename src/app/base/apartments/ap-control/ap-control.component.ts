import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApartmentsService } from '../apartments.service';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-ap-control',
  templateUrl: './ap-control.component.html',
  styleUrls: ['./ap-control.component.scss']
})
export class ApControlComponent implements OnInit {

  public uid: any;
  public rePassword: string;
  public loaderBtn = true;
  public entity: any = {};
  public oldEntity: any = {};

  constructor(private activatedRoute: ActivatedRoute, private apService: ApartmentsService, private router: Router, private as: AuthService, private notif: NotifierService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.uid) {
        this.apService.getOne(params.uid).then((resp) => {
          if (resp) {
            this.entity = resp;
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
  }

  goBack() {
    this.router.navigate(['/app/apartments']);
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
      if (!this.entity.number ||
        !this.entity.email ||
        !this.entity.phone ||
        !this.entity.person) {
        return true;
      }
    } else {
      if (!this.entity.number ||
        !this.entity.email ||
        !this.entity.phone ||
        !this.entity.password ||
        !this.rePassword ||
        !this.entity.person) {
        return true;
      }
    }
    return false;
  }

  saveApartment() {
    if (!this.uid && !this.validadePassword()) {
      this.notif.notify('error', 'Campo Senha e Repetir Senha estão diferentes.');
      return;
    }
    this.loaderBtn = false;
    this.apService.saveApartments(this.uid, this.entity, this.oldEntity).then(() => {
      if (this.uid) {
        this.notif.notify('success', 'Uhull, apartamento alterado com sucesso!!!');
      } else {
        this.notif.notify('success', 'Uhull, apartamento cadastrado com sucesso!!!');
      }
    }).catch((err) => {
      this.as.translateError(err);
      this.loaderBtn = true;
    });
  }

}
