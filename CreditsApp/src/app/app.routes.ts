import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { HomeComponent } from './Pages/home/home.component';
import { UserComponent } from './Pages/user/user.component';
import { CreditsApplicationComponent } from './credits-application/credits-application.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {path: 'user', component: UserComponent, canActivate: [authGuard] },
  {path: 'credits', component: CreditsApplicationComponent, canActivate: [authGuard] },
  {path: '**', redirectTo: '/login'}
];
