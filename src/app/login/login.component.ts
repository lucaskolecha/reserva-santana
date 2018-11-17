import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: string
  public password: any
  public loaderBtn: boolean
  public errorText: String
  public close: boolean

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loaderBtn = true
    this.close = false
    this.errorText = ''
  }

  clearError () {
    document.getElementById('login').classList.remove('err');
    document.getElementById('error').classList.remove('active');
    document.getElementById('pass').classList.add('op1');
    document.getElementById('pass').classList.remove('op0');
    this.errorText = '';
  }

  signIn() {
    this.loaderBtn = false;
    this.authService.signIn(this.email, this.password).then(() => {
    }).catch((err) => {
      document.getElementById('login').classList.add('err');
      document.getElementById('error').classList.add('active');
      document.getElementById('pass').classList.add('op0');
      document.getElementById('pass').classList.remove('op1');
      this.errorText = this.authService.translateLoginError();
      this.loaderBtn = true;
    });
  }

  forgotPassword() {
    this.close = !this.close
  }

  resetPassword() {
    this.authService.forgotPassword(this.email).then((teste) => {
      console.log('tela',teste)
    })
  }

}
