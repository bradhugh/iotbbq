import { IThermometerService, ITemps, ThermometerState } from './contracts/IThermometerService';

import { XPlatService } from './XPlatService';
import { Peripheral } from 'noble';

export class BtThermometer implements IThermometerService {

  private static RSSI_THRESHOLD    = -90;

  private ready = false;

  private inRange: Peripheral[] = [];

  constructor(private xplat: XPlatService) {
    this.initialize();
  }

  private initialize() {

    if (this.xplat.noble.state === 'poweredOn') {
      this.ready = true;
    }

    this.xplat.noble.on('stateChange', (state) => {
      console.log(`State change ${state}`);
      if (state === 'poweredOn') {
        this.xplat.noble.startScanning([], true);
        this.ready = true;
      } else {
        this.xplat.noble.stopScanning();
        this.ready = false;
      }
    });

    this.xplat.noble.on('discover', (peripheral) => {
      if (peripheral.rssi < BtThermometer.RSSI_THRESHOLD) {
        // ignore
        return;
      }

      const id = peripheral.id;
      const entered = !this.inRange[id];

      if (entered) {
        this.inRange[id] = {
          peripheral: peripheral
        };

        console.log('"' + peripheral.advertisement.localName + '" entered (RSSI ' + peripheral.rssi + ') ' + new Date());
      }
    });
  }

  public async readThermometer(probeNumber: number): Promise<ITemps> {
    return {
      celsius: 0,
      fahrenheit: 0,
      kelvin: 0,
      state: ThermometerState.Disconnected
    };
  }
}
