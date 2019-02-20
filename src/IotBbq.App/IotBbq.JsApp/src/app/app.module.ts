/// <reference types="@types/winrt-uwp" />

import 'reflect-metadata';
import '../polyfills';
import { NgModule, Inject } from '@angular/core';

// Directives
import { WebviewDirective } from './directives/webview.directive';

// Modules
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { MatIconModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';

// NGX-Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Tokens and interfaces
import { GPIO_FACTORY_TOKEN, IGpioFactory } from './services/IGpio';
import { SPICLIENT_TOKEN, ISpiClient } from './services/ISpiClient';
import { DATA_STORAGE_TOKEN, IDataStorage } from './services/IDataStorage';
import { IExportService, EXPORT_SERVICE_TOKEN } from './services/IExportService';

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
import { ExportStatusComponent } from './components/export-status/export-status.component';

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
import { ExportService } from './services/node/ExportService';

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
import { NullExportService } from './services/design/NullExportService';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function GpioFactoryFactory(electron: ElectronService): IGpioFactory {
  if (electron.isElectron() && electron.isArm()) {
    console.log('Using Raspberry GPIO');
    return new NodeGpioFactory(electron);
  } else if (electron.isUwp() && electron.isArm()) {
    console.log('Using UWP GPIO');
    return new UwpGpioFactory();
  } else {
    console.log('Using NULL GPIO');
    return new NullGpioFactory();
  }
}

export function SpiClientFactory(electron: ElectronService): ISpiClient {
  if (electron.isElectron() && electron.isArm()) {
    console.log('Using Raspberry SPI');
    return new NodeSpiClient(electron);
  } else if (electron.isUwp() && electron.isArm()) {
    console.log('Using UWP SPI');
    return new UwpSpiClient();
  } else {
    console.log('Using Design SPI');
    return new DesignSpiClient();
  }
}

function ExportServiceFactory(
  electron: ElectronService,
  dataStorage: IDataStorage,
  dialog: MatDialog): IExportService {
  if (electron.isElectron()) {
    console.log('Using Node ExportService');
    return new ExportService(electron, dataStorage, dialog);
  } else {
    return new NullExportService();
  }
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
    ExportStatusComponent,
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
    SmokerEditorComponent, PhasePickerComponent, ExportStatusComponent],
  providers: [
    ElectronService,
    EventEditorService,
    ItemEditorService,
    ItemLoggerService,
    SmokerEditorService,
    PhaseChooserService,
    ThermometerService,
    AlarmService,
    { provide: EXPORT_SERVICE_TOKEN, useFactory: ExportServiceFactory, deps: [ ElectronService, DATA_STORAGE_TOKEN, MatDialog ] },
    { provide: DATA_STORAGE_TOKEN, useClass: IndexedDbDataStorage },
    { provide: SPICLIENT_TOKEN, useFactory: SpiClientFactory, deps: [ ElectronService ] },
    { provide: GPIO_FACTORY_TOKEN, useFactory: GpioFactoryFactory, deps: [ ElectronService ] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
