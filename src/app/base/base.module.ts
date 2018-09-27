import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatPaginatorModule } from '@angular/material';

/* Components */
import { BaseComponent } from './base.component';
import { HomeComponent } from './home/home.component';
import { ApartmentsComponent } from './apartments/apartments.component';
import { ApControlComponent } from './apartments/ap-control/ap-control.component';
import { CompanyComponent } from './company/company.component';
import { CoControlComponent } from './company/co-control/co-control.component';
import { ProductsComponent } from './products/products.component';
import { PrControlComponent } from './products/pr-control/pr-control.component';

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ] ,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    RouterModule.forChild([
      {
        path: 'app',
        component: BaseComponent,
        children: [
          {
            path: 'home',
            component: HomeComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'apartments',
            component: ApartmentsComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'apartments/new',
            component: ApControlComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'apartments/edit/:uid',
            component: ApControlComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'company',
            component: CompanyComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'company/new',
            component: CoControlComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'company/edit/:uid',
            component: CoControlComponent,
            canActivate: [AuthGuard]
          },
          // {
          //   path: 'orders',
          //   component: OrdersComponent,
          //   canActivate: [AuthGuard]
          // },
          {
            path: 'products',
            component: ProductsComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'products/new',
            component: PrControlComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'products/edit/:uid',
            component: PrControlComponent,
            canActivate: [AuthGuard]
          }
        ]
      }
    ])
  ],
  declarations: [HomeComponent, ApartmentsComponent, ApControlComponent, CompanyComponent, CoControlComponent, ProductsComponent, PrControlComponent]
})
export class BaseModule { }
