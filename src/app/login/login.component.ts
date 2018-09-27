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

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signIn() {
    this.authService.signIn(this.email, this.password);
  }

}
