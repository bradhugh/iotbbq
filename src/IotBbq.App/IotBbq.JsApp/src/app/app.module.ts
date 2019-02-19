/// <reference types="@types/winrt-uwp" />

import 'reflect-metadata';
import '../polyfills';
import { NgModule } from '@angular/core';

// Directives
import { WebviewDirective } from './directives/webview.directive';

// Modules
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { MatIconModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';

// NGX-Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Tokens
import { GPIO_FACTORY_TOKEN } from './services/IGpio';
import { SPICLIENT_TOKEN } from './services/ISpiClient';
import { THERM_SVC_TOKEN } from './services/IThermometerService';
import { ALARM_SVC_TOKEN } from './services/IAlarmService';
import { DATA_STORAGE_TOKEN } from './services/IDataStorage';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CookComponent } from './components/cook/cook.component';
import { BbqItemComponent } from './components/bbq-item/bbq-item.component';
import { SmokerComponent } from './components/smoker/smoker.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { EventInfoComponent } from './components/event-info/event-info.component';
import { ItemEditorComponent } from './components/item-editor/item-editor.component';
import { EventEditorComponent } from './components/event-editor/event-editor.component';
import { SmokerEditorComponent } from './components/smoker-editor/smoker-editor.component';
import { PhasePickerComponent } from './components/phase-picker/phase-picker.component';

// Services
import { AlarmService } from './services/AlarmService';
import { IndexedDbDataStorage } from './services/IndexedDbDataStorage';
import { ItemEditorService } from './services/ItemEditorService';
import { ItemLoggerService } from './services/ItemLoggerService';
import { EventEditorService } from './services/EventEditorService';
import { ElectronService } from './services/electron.service';
import { SmokerEditorService } from './services/SmokerEditorService';
import { PhaseChooserService } from './services/PhaseChooserService';
import { ThermometerService } from './services/ThermometerService';
import { ExitService } from './services/ExitService';

// UWP services
import { UwpSpiClient } from './services/uwp/UwpSpiClient';
import { UwpGpioFactory } from './services/uwp/UwpGpio';

// Raspberry PI services
import { NodeSpiClient } from './services/node/NodeSpiClient';
import { NodeGpioFactory } from './services/node/NodeGpio';
import { SimpleGpioFactory } from './services/node/SimpleGpio';

// Design services
import { DesignSpiClient } from './services/design/DesignSpiClient';
import { NullGpioFactory } from './services/design/NullGpio';
import { InMemoryStorage } from './services/design/InMemoryStorage';
import { ExportService } from './services/ExportService';

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
    EventEditorComponent,
    SmokerEditorComponent,
    PhasePickerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,

    // ngx-bootstrap
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
  entryComponents: [ItemEditorComponent, EventEditorComponent,
    SmokerEditorComponent, PhasePickerComponent],
  providers: [
    ElectronService,
    EventEditorService,
    ItemEditorService,
    ItemLoggerService,
    SmokerEditorService,
    PhaseChooserService,
    ExportService,
    { provide: THERM_SVC_TOKEN, useClass: ThermometerService },
    { provide: DATA_STORAGE_TOKEN, useClass: IndexedDbDataStorage },
    { provide: ALARM_SVC_TOKEN, useClass: AlarmService },
    // { provide: SPICLIENT_TOKEN, useClass: NodeSpiClient },
    // { provide: GPIO_FACTORY_TOKEN, useClass: NodeGpioFactory },
    { provide: SPICLIENT_TOKEN, useClass: DesignSpiClient },
    { provide: GPIO_FACTORY_TOKEN, useClass: NullGpioFactory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
