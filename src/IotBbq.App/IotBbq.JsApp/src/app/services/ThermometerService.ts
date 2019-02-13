import { IThermometerService, ITemps } from './IThermometerService';
import { Inject } from '@angular/core';
import { SPICLIENT_TOKEN, ISpiClient } from './ISpiClient';
import { Mcp3008, Channels } from './Mcp3008';

export class ThermometerService implements IThermometerService {

  private mcp: Mcp3008;

  constructor(
    @Inject(SPICLIENT_TOKEN) spiClient: ISpiClient
  ) {
    this.mcp = new Mcp3008(spiClient, 0);
  }

  async readThermometer(index: number): Promise<ITemps> {

    const reading = await this.mcp.read(Channels.Single0);

    const value = reading.getNormalizedValue();
    return {
      celcius: value,
      farenheight: value,
      kelvin: value,
    };
  }
}
