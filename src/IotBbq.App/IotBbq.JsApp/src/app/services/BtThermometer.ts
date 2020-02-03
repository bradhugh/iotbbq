import { IThermometerService, ITemps, ThermometerState } from './contracts/IThermometerService';

import * as noble from 'noble';
import { XPlatService } from './XPlatService';

export class BtThermometer implements IThermometerService {

  private initializing = false;

  constructor(private xplat: XPlatService) {
  }

  public async readThermometer(probeNumber: number): Promise<ITemps> {
    if (!this.initializing) {
      this.initializing = true;
      await this.initializeRemote();
    }

    return {
      celcius: 0,
      farenheight: 0,
      kelvin: 0,
      state: ThermometerState.Disconnected
    };
  }

  private async powerOn(): Promise<void> {
    new Promise((resolve, reject) => {
      noble.on('stateChange', (state) => {
        console.log(`State change ${state}`);
        if (state === 'poweredOn') { resolve(); }
        if (state === 'poweredOff') { reject(new Error('Bluetooth failed to initialize.')); }
      });
    });
  }

  private async startScanning(): Promise<void> {
    return new Promise((resolve, reject) => {
      noble.startScanning((err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  private async initializeRemote(): Promise<void> {
    console.log('PowerOn');
    await this.powerOn();
    console.log('StartScanning');
    await this.startScanning();
    console.log('Done');
  }
}
