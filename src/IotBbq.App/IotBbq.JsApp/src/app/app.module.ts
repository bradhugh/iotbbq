/// <reference types="@types/winrt-uwp" />

import 'reflect-metadata';
import '../polyfills';
import { NgModule, Inject } from '@angular/core';

// Directives
import { WebviewDirective } from './directives/webview.directive';
import { ScrollIntoViewDirective } from './directives/scrollintoview.directive';

// Modules
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';

// NGX-Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Tokens and interfaces
import { GPIO_FACTORY_TOKEN, IGpioFactory } from './services/contracts/IGpio';
import { SPICLIENT_TOKEN, ISpiClient } from './services/contracts/ISpiClient';
import { DATA_STORAGE_TOKEN, IDataStorage } from './services/contracts/IDataStorage';
import { IExportService, EXPORT_SERVICE_TOKEN } from './services/contracts/IExportService';

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
import { ClockEditorComponent } from './components/clock-editor/clock-editor.component';

// Services
import { AlarmService } from './services/AlarmService';
import { IndexedDbDataStorage } from './services/IndexedDbDataStorage';
import { ItemEditorService } from './services/ItemEditorService';
import { ItemLoggerService } from './services/ItemLoggerService';
import { EventEditorService } from './services/EventEditorService';
import { XPlatService } from './services/XPlatService';
import { SmokerEditorService } from './services/SmokerEditorService';
import { PhaseChooserService } from './services/PhaseChooserService';
import { ThermometerService } from './services/ThermometerService';
import { ExitService } from './services/ExitService';
import { ExportService } from './services/node/ExportService';
import { AzureUploadService } from './services/AzureUploadService';
import { ClockEditorService } from './services/ClockEditorService';

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

export function GpioFactoryFactory(xplat: XPlatService): IGpioFactory {
  if (xplat.isElectron() && xplat.isArm()) {
    console.log('Using Raspberry GPIO');
    return new NodeGpioFactory(xplat);
  } else if (xplat.isUwp() && xplat.isArm()) {
    console.log('Using UWP GPIO');
    return new UwpGpioFactory();
  } else {
    console.log('Using NULL GPIO');
    return new NullGpioFactory();
  }
}

export function SpiClientFactory(xplat: XPlatService): ISpiClient {
  if (xplat.isElectron() && xplat.isArm()) {
    console.log('Using Raspberry SPI');
    return new NodeSpiClient(xplat);
  } else if (xplat.isUwp() && xplat.isArm()) {
    console.log('Using UWP SPI');
    return new UwpSpiClient();
  } else {
    console.log('Using Design SPI');
    return new DesignSpiClient();
  }
}

export function ExportServiceFactory(
  xplat: XPlatService,
  dataStorage: IDataStorage,
  dialog: MatDialog): IExportService {
  if (xplat.isElectron()) {
    console.log('Using Node ExportService');
    return new ExportService(xplat, dataStorage, dialog);
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
    ScrollIntoViewDirective,
    ClockEditorComponent,
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
  entryComponents: [
    ItemEditorComponent, EventEditorComponent, SmokerEditorComponent,
    PhasePickerComponent, ExportStatusComponent, ClockEditorComponent],
  providers: [
    XPlatService,
    EventEditorService,
    ItemEditorService,
    ItemLoggerService,
    AzureUploadService,
    SmokerEditorService,
    PhaseChooserService,
    ThermometerService,
    AlarmService,
    ClockEditorService,
    { provide: EXPORT_SERVICE_TOKEN, useFactory: ExportServiceFactory, deps: [ XPlatService, DATA_STORAGE_TOKEN, MatDialog ] },
    { provide: DATA_STORAGE_TOKEN, useClass: IndexedDbDataStorage },
    { provide: SPICLIENT_TOKEN, useFactory: SpiClientFactory, deps: [ XPlatService ] },
    { provide: GPIO_FACTORY_TOKEN, useFactory: GpioFactoryFactory, deps: [ XPlatService ] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
