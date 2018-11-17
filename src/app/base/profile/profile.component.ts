import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CompanyService } from '../company/company.service'
import { AuthService } from '../../auth/auth.service';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public entity: any
  public uid: string
  public rePassword: string
  public loaderBtn:boolean
  public oldEntity: any

  constructor(private router: Router, public companyService: CompanyService, private as: AuthService, private notif: NotifierService) {
    this.entity = {}
    this.loaderBtn = true
    this.uid = sessionStorage.getItem('tokenUid')
  }

  ngOnInit() {
    this.companyService.getOne(this.uid).then((response) => {
      this.entity = response
      this.oldEntity = Object.assign({}, this.entity)
      this.entity.password = ''
    })
  }

  validadePassword() {
    let resp: boolean
    if (!this.uid) {
      resp = this.as.verifyPassword(this.entity.password, this.rePassword);
      if (!resp) {
        this.entity.password = ''
        this.rePassword = ''
        document.getElementById('password').focus();
      }
      return resp
    }
  }

  saveCompany() {
    if (!this.uid && !this.validadePassword()) {
      this.notif.notify('error', 'Campo Senha e Repetir Senha estão diferentes.')
      return
    }
    this.loaderBtn = false
    this.companyService.saveCompany(this.uid, this.entity, this.oldEntity).then((resp) => {
      this.loaderBtn = true
    }).catch((err) => {
      this.as.translateError(err);
      this.loaderBtn = true;
    })
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
        !this.rePassword) {
        return true;
      }
    }
    return false;
  }

}