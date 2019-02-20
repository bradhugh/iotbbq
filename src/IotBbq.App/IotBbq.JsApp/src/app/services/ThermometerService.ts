import { Inject } from '@angular/core';
import { SPICLIENT_TOKEN, ISpiClient } from './ISpiClient';
import { Mcp3008, Channels, Channel } from './Mcp3008';
import { TempUtils } from './TempUtils';
import { Utility } from './Utility';

export interface ITemps {
  kelvin: number;
  celcius: number;
  farenheight: number;
}

interface CoefficientSet {
  A: number;
  B: number;
  C: number;
}

export class ThermometerService {

  private static inputVoltage = 3.3;

  private static balancingResistorOhms = 100000;

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

  private coefficients: CoefficientSet = {
    A: 0.5037245563E-3,
    B: 2.472223870E-4,
    C: 0.07524447351E-7,
  };

  constructor(
    @Inject(SPICLIENT_TOKEN) spiClient: ISpiClient
  ) {
    this.mcp = new Mcp3008(spiClient, 0);
  }

  public async readThermometer(index: number): Promise<ITemps> {

    if (index < 0 || index > 7) {
      throw new Error('Index must be from 0-7');
    }

    let sum = 0;
    const numSamples = 3;
    for (let i = 0; i < numSamples; i++) {
      const reading = await this.mcp.read(this.channels[index]);
      sum += reading.getNormalizedValue();
      await Utility.sleep(100);
    }

    const averageValue = sum / numSamples;

    const voltage = averageValue * ThermometerService.inputVoltage;
    const resistance = TempUtils.getThermistorResistenceFromVoltage(3.3, voltage, ThermometerService.balancingResistorOhms);

    const temps: ITemps = {
      celcius: 0,
      farenheight: 0,
      kelvin: 0,
    };

    // TODO: Check this check
    if (resistance !== NaN) {
      temps.kelvin = TempUtils.resistanceToTemp(this.coefficients.A, this.coefficients.B, this.coefficients.C, resistance);
    }

    temps.celcius = TempUtils.kelvinToCelcius(temps.kelvin);
    temps.farenheight = TempUtils.celciusToFarenheight(temps.celcius);

    return temps;
  }
}
