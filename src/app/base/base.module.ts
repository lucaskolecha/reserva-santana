import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AuthGuard } from '../auth/auth.guard'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTableModule, MatPaginatorModule } from '@angular/material'
import { NgxMaskModule } from 'ngx-mask'
import { NgxCurrencyModule } from "ngx-currency"
import { UiSwitchModule } from 'ngx-toggle-switch'

/* Components */
import { BaseComponent } from './base.component'
import { HomeComponent } from './home/home.component'
import { ApartmentsComponent } from './apartments/apartments.component'
import { ApControlComponent } from './apartments/ap-control/ap-control.component'
import { CompanyComponent } from './company/company.component'
import { CoControlComponent } from './company/co-control/co-control.component'
import { ProductsComponent } from './products/products.component'
import { PrControlComponent } from './products/pr-control/pr-control.component'
import { OrdersComponent } from './orders/orders.component'
import { ProfileComponent } from './profile/profile.component'

/* Services */
import { NotificationService } from './services/notification.service'
import { StorageService } from './services/storage.service'
import { OrdersService } from './orders/orders.service'
import { CompanyService } from './company/company.service'
import { ApartmentsService } from './apartments/apartments.service'
import { ProductsService } from './products/products.service'

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    NgxCurrencyModule,
    UiSwitchModule,
    NgxMaskModule.forRoot(),
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
            path: 'profile',
            component: ProfileComponent,
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
          {
            path: 'orders',
            component: OrdersComponent,
            canActivate: [AuthGuard]
          },
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
  declarations: [HomeComponent, ApartmentsComponent, ApControlComponent, CompanyComponent, CoControlComponent, ProductsComponent, PrControlComponent, OrdersComponent, ProfileComponent],
  providers: [NotificationService, StorageService, OrdersService, CompanyService, ApartmentsService, ProductsService]
})
export class BaseModule { }
