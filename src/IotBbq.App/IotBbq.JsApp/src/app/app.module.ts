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

// NGX-Bootstrap
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { ElectronService } from './services/electron.service';

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
import { ItemEditorService } from './services/ItemEditorService';
import { ItemEditorComponent } from './components/item-editor/item-editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { ItemLoggerService } from './services/ItemLoggerService';
import { EventEditorService } from './services/EventEditorService';
import { EventEditorComponent } from './components/event-editor/event-editor.component';
import { ALARM_SVC_TOKEN } from './services/IAlarmService';
import { MatIconModule } from '@angular/material';
import { AlarmService } from './services/AlarmService';
import { GPIO_FACTORY_TOKEN } from './services/IGpio';
import { NullGpioFactory } from './services/design/NullGpio';
import { UwpGpioFactory } from './services/uwp/UwpGpio';
import { NodeGpioFactory } from './services/node/NodeGpio';
import { SimpleGpioFactory } from './services/node/SimpleGpio';

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
    ExitService,
    ItemEditorComponent,
    EventEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,

    // ngx-bootstrap
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),

    // translate module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,

    // Material Modules
    MatButtonModule,
    MatKeyboardModule,
    MatDialogModule,
    MatIconModule,
  ],
  entryComponents: [ItemEditorComponent, EventEditorComponent],
  providers: [
    ElectronService,
    EventEditorService,
    ItemEditorService,
    ItemLoggerService,
    { provide: SPICLIENT_TOKEN, useClass: DesignSpiClient },
    { provide: THERM_SVC_TOKEN, useClass: ThermometerService },
    { provide: DATA_STORAGE_TOKEN, useClass: IndexedDbDataStorage },
    { provide: GPIO_FACTORY_TOKEN, useClass: NullGpioFactory },
    { provide: ALARM_SVC_TOKEN, useClass: AlarmService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
