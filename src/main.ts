import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import localeIt from '@angular/common/locales/it';
import {registerLocaleData} from "@angular/common";

// Registra il locale italiano
registerLocaleData(localeIt);


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
