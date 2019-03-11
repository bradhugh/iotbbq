/// <reference types="@types/winrt-uwp" />

import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as onoff from 'onoff';
import * as pispi from 'pi-spi';
import * as drivelist from 'drivelist';
import { DateTimeControl } from 'set-system-clock';

@Injectable()
export class XPlatService {

  public ipcRenderer: typeof ipcRenderer;
  public webFrame: typeof webFrame;
  public remote: typeof remote;
  public childProcess: typeof childProcess;
  public fs: typeof fs;
  public os: typeof os;
  public path: typeof path;
  public onoff: typeof onoff;
  public pispi: typeof pispi;
  public drivelist: typeof drivelist;
  public dateTimeControl: DateTimeControl;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.os = window.require('os');
      this.path = window.require('path');

      // Remote native modules
      this.drivelist = this.remote.require('drivelist');
      this.dateTimeControl = new (this.remote.require('set-system-clock').DateTimeControl)();

      // These native modules are only used on the PI
      if (this.isArm()) {
        this.onoff = this.remote.require('onoff');
        this.pispi = this.remote.require('pi-spi');
      }
    }
  }

  isElectron = (): boolean => {
    return window && window.process && window.process.type;
  }

  isUwp = (): boolean => {
    return typeof Windows !== 'undefined'
      && typeof Windows.ApplicationModel !== 'undefined'
      && typeof Windows.ApplicationModel.Package !== 'undefined';
  }

  isArm = (): boolean => {
    if (this.isUwp()) {
      return Windows.ApplicationModel.Package.current.id.architecture === Windows.System.ProcessorArchitecture.arm;
    } else if (this.isElectron()) {
      return this.os.arch() === 'arm';
    }
  }
}
