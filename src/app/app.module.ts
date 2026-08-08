import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, RouterOutlet} from '@angular/router';
import { AppComponent } from './app.component';
import {CContact} from "./comp/contact/c";
import {CFooter} from "./comp/footer/c";
import {CWebinarDetail} from "./comp/webinar/c-detail";
import {CServizio} from "./comp/servizi/c";
import {SiteService} from "./service/siteservice";
import {CHero} from "./comp/hero/c";
import {CAbout} from "./comp/about/c";
import {appRouterOptions, appRoutes} from "./app.routes";
import {CProcess} from "./comp/process/c";
import {CHeader} from "./comp/header/c";
import {CAudio} from "./comp/media/audio";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Site} from "./dto/main";
import {CommonModule} from "@angular/common";

function normalizeHashbangUrl(): () => void {
  return () => {
    const hash = window.location.hash;
    if (!hash.startsWith('#!')) {
      return;
    }

    const normalizedHash = hash.startsWith('#!/')
      ? '#/' + hash.slice(3)
      : '#/' + hash.slice(2);
    const normalizedUrl = `${window.location.pathname}${window.location.search}${normalizedHash}`;
    window.history.replaceState(window.history.state, '', normalizedUrl);
  };
}

function preloadSiteConfig(httpClient: HttpClient, siteService: SiteService): () => Promise<Site> {
  return () => firstValueFrom(httpClient.get<Site>('assets/site.json?' + new Date().getTime())).then(site => {
    siteService.site = site;
    return site;
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        CommonModule,
        RouterModule.forRoot(appRoutes, appRouterOptions),
        HttpClientModule,
        CContact,
        CFooter,
        CWebinarDetail,
        CServizio,
        CHero,
        CAbout,
        RouterOutlet,
        CProcess,
        CHeader,
        CAudio
    ],
  providers: [
    SiteService,
    {
      provide: APP_INITIALIZER,
      useFactory: normalizeHashbangUrl,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: preloadSiteConfig,
      deps: [HttpClient, SiteService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

    
    
}
