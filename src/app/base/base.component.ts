import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  private navbar;
  
  constructor(private authService: AuthService, private router:Router) {
    this.navbar = [
      { name: 'Início', icon: 'fas fa-home', link: '/app/home' },
      { name: 'Apartamentos',  icon: 'fas fa-building', link: '/app/apartments' },
      { name: 'Empresas',  icon: 'fas fa-industry', link: '/app/company' },
      { name: 'Pedidos',  icon: 'fas fa-paperclip', link: '/app/orders' },
      { name: 'Produtos',  icon: 'fas fa-box-open', link: '/app/products' }
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
