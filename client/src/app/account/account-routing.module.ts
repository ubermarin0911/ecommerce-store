import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginRegisterComponent } from './login-register/login-register.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent, data: { breadcrumb: 'Iniciar sesión' }},
  {path: 'register', component: RegisterComponent, data: { breadcrumb: 'Registro' }},
  {path: 'login-register', component: LoginRegisterComponent, data: { breadcrumb: 'Autenticación' }},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
