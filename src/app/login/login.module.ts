import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'login',
        component: LoginComponent
      }
    ])
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
