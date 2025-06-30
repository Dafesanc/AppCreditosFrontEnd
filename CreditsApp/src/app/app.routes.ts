import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { HomeComponent } from './Pages/home/home.component';
import { UserComponent } from './Pages/user/user.component';
import { authGuard } from './guards/auth.guard';
import { CreditsApplicationComponent } from './Pages/credits-application/credits-application.component';
import { MyProductsComponent } from './Pages/my-products/my-products.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {path: 'user', component: UserComponent, canActivate: [authGuard] },
  {path: 'credits', component: CreditsApplicationComponent, canActivate: [authGuard] },
  {path: 'my-products', component: MyProductsComponent, canActivate: [authGuard] },
  {path: '**', redirectTo: '/login'}
];
