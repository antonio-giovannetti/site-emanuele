import { ExtraOptions, Routes } from '@angular/router';
import {CAbout} from "./comp/about/c";
import {CLogo} from "./comp/logo/c";
import {CAllHome} from "./comp/all_home/c";
import {CCert} from "./comp/cert/c";

export const appRoutes: Routes = [
  {
    path: '',
    component: CAllHome
  },
  {
    path: 'about',
    component: CAbout
  },
  {
    path: 'logo',
    component: CLogo
  },
  {
    path: 'cert',
    component: CCert
  }


];

export const appRouterOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload'
};
