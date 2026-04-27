import { Routes } from '@angular/router';
import {LandingPage} from './components/landing-page/landing-page';
import { LoginPage } from './components/login-page/login-page';
import { ExplorePage } from './components/explore-page/explore-page';
import { authGuard } from './guards/auth-guard';

const titleBase = 'AgroFlow - ';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    title: titleBase + 'Welcome'
  },
  {
    path: 'login',
    component: LoginPage,
    title: titleBase + 'Login'
  },
  {
    path: 'explore',
    component: ExplorePage,
    title: titleBase + 'Explore',
    canActivate: [authGuard],
  },
];
