import { Component } from '@angular/core';
import { XPlatService } from './services/XPlatService';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public xplat: XPlatService,
    private translate: TranslateService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (xplat.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', xplat.ipcRenderer);
      console.log('NodeJS childProcess', xplat.childProcess);
    } else {
      console.log('Mode web');
    }
  }
}
