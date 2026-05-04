import { Routes } from '@angular/router';
import {LandingPage} from './components/landing-page/landing-page';
import { LoginPage } from './components/login-page/login-page';
import { ExplorePage } from './components/explore-page/explore-page';
import { authGuard } from './guards/auth-guard';
import { ProfilePage } from './components/profile-page/profile-page';
import { adminGuardGuard } from './guards/admin-guard-guard';
import { AdminPanel } from './components/admin-panel/admin-panel';

const titleBase = 'AgroFlow - ';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    title: titleBase + 'Welcome',
  },
  {
    path: 'login',
    component: LoginPage,
    title: titleBase + 'Login',
  },
  {
    path: 'explore',
    component: ExplorePage,
    title: titleBase + 'Explore',
    canActivate: [authGuard],
  },
  {
    path: 'profile/:id',
    component: ProfilePage,
    title: titleBase + 'Profile',
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminPanel,
    title: titleBase + 'Admin Panel',
    canActivate: [authGuard, adminGuardGuard],
  },
];
