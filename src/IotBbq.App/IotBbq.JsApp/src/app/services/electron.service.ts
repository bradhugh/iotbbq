/// <reference types="@types/winrt-uwp" />

import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  os: typeof os;
  path: typeof path;

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
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  isUwp = () => {
    return typeof Windows !== 'undefined';
  }

  isArm = () => {
    if (this.isUwp()) {
      return Windows.ApplicationModel.Package.current.id.architecture === Windows.System.ProcessorArchitecture.arm;
    } else if (this.isElectron()) {
      return this.os.arch() === 'arm';
    }
  }
}
