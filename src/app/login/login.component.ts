import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private email: string;
  private password: any;
  public loaderBtn: boolean = true;
  public errorText: String = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
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

}
