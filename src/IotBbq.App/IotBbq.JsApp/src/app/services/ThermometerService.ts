import { IThermometerService, ITemps } from './IThermometerService';
import { Inject } from '@angular/core';
import { SPICLIENT_TOKEN, ISpiClient } from './ISpiClient';

export class ThermometerService implements IThermometerService {

  constructor(
    @Inject(SPICLIENT_TOKEN) private spiClient: ISpiClient
  ) {}

  async readThermometer(index: number): Promise<ITemps> {

    await this.spiClient.initialize();

    return {
      celcius: 0,
      farenheight: 0,
      kelvin: 0,
    };
  }
}
