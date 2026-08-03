import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, RouterOutlet} from '@angular/router';
import { AppComponent } from './app.component';
import {CContact} from "./comp/contact/c";
import {CFooter} from "./comp/footer/c";
import {CWebinar} from "./comp/webinar/c";
import {CServizio} from "./comp/servizi/c";
import {SiteService} from "./service/siteservice";
import {CHero} from "./comp/hero/c";
import {CAbout} from "./comp/about/c";
import {appRouterOptions, appRoutes} from "./app.routes";
import {CProcess} from "./comp/process/c";
import {CHeader} from "./comp/header/c";
import {CAudio} from "./comp/sound/c";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, appRouterOptions),
        HttpClientModule,
        CContact,
        CFooter,
        CWebinar,
        CServizio,
        CHero,
        CAbout,
        RouterOutlet,
        CProcess,
        CHeader,
        CAudio
    ],
  providers: [SiteService],
  bootstrap: [AppComponent]
})
export class AppModule {

    
    
}
