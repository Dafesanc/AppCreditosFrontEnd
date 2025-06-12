import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { HomeComponent } from './Pages/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'home', component: HomeComponent, canActivate: [authGuard] },
  // Agrega aquí otras rutas protegidas con el authGuard
  {path: '**', redirectTo: '/login'}
];
