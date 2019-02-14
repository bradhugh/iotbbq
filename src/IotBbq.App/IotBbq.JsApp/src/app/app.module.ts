import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CookComponent } from './components/cook/cook.component';
import { BbqItemComponent } from './components/bbq-item/bbq-item.component';
import { SmokerComponent } from './components/smoker/smoker.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { EventInfoComponent } from './components/event-info/event-info.component';
import { SPICLIENT_TOKEN } from './services/ISpiClient';
import { UwpSpiClient } from './services/uwp/UwpSpiClient';
import { THERM_SVC_TOKEN } from './services/IThermometerService';
import { ThermometerService } from './services/ThermometerService';
import { DesignSpiClient } from './services/design/DesignSpiClient';
import { ExitService } from './services/ExitService';
import { DATA_STORAGE_TOKEN } from './services/IDataStorage';
import { InMemoryStorage } from './services/design/InMemoryStorage';
import { IndexedDbDataStorage } from './services/IndexedDbDataStorage';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    CookComponent,
    BbqItemComponent,
    SmokerComponent,
    CountdownComponent,
    EventInfoComponent,
    ExitService
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService,
    { provide: SPICLIENT_TOKEN, useClass: DesignSpiClient },
    { provide: THERM_SVC_TOKEN, useClass: ThermometerService },
    { provide: DATA_STORAGE_TOKEN, useClass: IndexedDbDataStorage },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
