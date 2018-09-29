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

  private uid: any;
  private rePassword: string;

  private entity: any = {
    number: null,
    person: null,
    email: null,
    password: null
  };

  private oldEntity: any = {
    number: null,
    person: null,
    email: null,
    password: null
  };

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
          console.log(e);
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
        !this.entity.person) {
        return true;
      }
    } else {
      if (!this.entity.number ||
        !this.entity.email ||
        !this.entity.password ||
        !this.rePassword ||
        !this.entity.person) {
        return true;
      }
    }
    return false;
  }

  saveApartment() {
    if (!this.validadePassword()) {
      this.notif.notify('error', 'Campo Senha e Repetir Senha estão diferentes.');
      return;
    }
    this.apService.saveApartments(this.uid, this.entity, this.oldEntity).then(() => {
      if (this.uid) {
        this.notif.notify('success', 'Uhull, apartamento alterado com sucesso!!!');
      } else {
        this.notif.notify('success', 'Uhull, apartamento cadastrado com sucesso!!!');
      }
    }).catch((err) => {
      this.as.translateError(err);
    });
  }

}
