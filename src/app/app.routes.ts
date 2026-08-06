import { ExtraOptions, Routes } from '@angular/router';
import {CLogo} from "./comp/logo/c";
import {CAllHome} from "./comp/all_home/c";
import {CCert} from "./comp/cert/c";
import {CWebinarDetail} from "./comp/webinar/c-detail";
import {webinarResolver} from "./service/siteservice";

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'hero'
  },
  {
    path: 'hero',
    component: CAllHome
  },
  {
    path: 'about',
    component: CAllHome
  },
  {
    path: 'webinar',
    component: CAllHome
  },
  {
    path: 'services',
    component: CAllHome
  },
  {
    path: 'service',
    component: CAllHome
  },
  {
    path: 'section',
    component: CAllHome
  },
  {
    path: 'contact',
    component: CAllHome
  },
  {
    path: 'logo',
    component: CLogo
  },
  {
    path: 'cert',
    component: CCert
  },
  {
    path: 'webinar/:id',
    component: CWebinarDetail,
    resolve: {
      webinar: webinarResolver
    }
  },
  {
    path: '**',
    redirectTo: 'hero'
  }


];

export const appRouterOptions: ExtraOptions = {
  useHash: true,
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload'
};
