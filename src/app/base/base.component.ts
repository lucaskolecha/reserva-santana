import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  public navbar;
  public typeUser;

  constructor(private authService: AuthService, private router: Router, private ls: LoaderService) {
    this.typeUser = sessionStorage.getItem('typeUser');
    this.navbar = [
      { name: 'Início', icon: 'fas fa-home', link: '/app/home', user: 'SYNDICATE' },
      { name: 'Apartamentos', icon: 'fas fa-building', link: '/app/apartments', user: 'SYNDICATE' },
      { name: 'Empresas', icon: 'fas fa-industry', link: '/app/company', user: 'SYNDICATE' },
      { name: 'Pedidos', icon: 'fas fa-paperclip', link: '/app/orders', user: 'COMPANY' },
      { name: 'Produtos', icon: 'fas fa-box-open', link: '/app/products', user: 'COMPANY' }
    ];
  }
  ngOnInit() {

  }

  goRoute(link) {
    this.router.navigate([link]);
  }

  logOut() {
    this.authService.logOut();
  }

}
