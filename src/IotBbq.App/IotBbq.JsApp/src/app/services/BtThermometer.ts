import { IThermometerService, ITemps } from './contracts/IThermometerService';

import * as noble from 'noble';

export class BtThermometer implements IThermometerService {

  private poweredOn: Promise<void>;

  constructor() {
    this.poweredOn = new Promise((resolve, reject) => {
      noble.on('stateChange', (state) => {
        if (state === 'poweredOn') { resolve(); }
        if (state === 'poweredOff') { reject(new Error('Bluetooth failed to initialize.')); }
      });
    });
  }

  public async readThermometer(probeNumber: number): Promise<ITemps> {
    await this.poweredOn;
    return Promise.resolve(null);
  }

}
