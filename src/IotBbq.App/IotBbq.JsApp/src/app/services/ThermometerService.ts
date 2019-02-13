import { IThermometerService, ITemps } from './IThermometerService';
import { Inject } from '@angular/core';
import { SPICLIENT_TOKEN, ISpiClient } from './ISpiClient';
import { Mcp3008, Channels, Channel } from './Mcp3008';

export class ThermometerService implements IThermometerService {

  private mcp: Mcp3008;

  private channels: Channel[] = [
    Channels.Single0,
    Channels.Single1,
    Channels.Single2,
    Channels.Single3,
    Channels.Single4,
    Channels.Single5,
    Channels.Single6,
    Channels.Single7,
  ];

  constructor(
    @Inject(SPICLIENT_TOKEN) spiClient: ISpiClient
  ) {
    this.mcp = new Mcp3008(spiClient, 0);
  }

  async readThermometer(index: number): Promise<ITemps> {

    if (index < 0 || index > 7) {
      throw new Error('Index must be from 0-7');
    }

    const reading = await this.mcp.read(this.channels[index]);

    const value = reading.getNormalizedValue();
    return {
      celcius: value,
      farenheight: value,
      kelvin: value,
    };
  }
}
