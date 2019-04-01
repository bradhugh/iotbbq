import { Inject } from '@angular/core';
import { SPICLIENT_TOKEN, ISpiClient } from './contracts/ISpiClient';
import { Mcp3008, Channels, Channel } from './Mcp3008';
import { TempUtils } from './TempUtils';
import { Utility } from './Utility';

export enum ThermometerState {
  Disconnected,
  Connected,
}

export interface ITemps {
  state: ThermometerState;
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

  public async readThermometer(probeNumber: number): Promise<ITemps> {

    if (probeNumber < 1 || probeNumber > 8) {
      throw new Error('Probe number must be from 1-8');
    }

    // SPI is zero-based so adjust probe number to the appropriate index
    const probeIndex = probeNumber - 1;

    let sum = 0;
    const numSamples = 3;
    for (let i = 0; i < numSamples; i++) {
      const reading = await this.mcp.read(this.channels[probeIndex]);

      // If any of our reading are zero, we have to treat it as disconnected
      if (reading.getRawValue() === 0) {
        return {
          state: ThermometerState.Disconnected,
          celcius: 0,
          farenheight: 0,
          kelvin: 0,
        };
      }

      sum += reading.getNormalizedValue();
      await Utility.sleep(100);
    }

    // We were able to read all X samples, compute the average
    const averageValue = sum / numSamples;

    const voltage = averageValue * ThermometerService.inputVoltage;
    const resistance = TempUtils.getThermistorResistenceFromVoltage(3.3, voltage, ThermometerService.balancingResistorOhms);

    const temps: ITemps = {
      state: ThermometerState.Disconnected,
      celcius: 0,
      farenheight: 0,
      kelvin: 0,
    };

    // TODO: Check this check, not sure how this would be possible
    if (resistance !== NaN) {
      temps.state = ThermometerState.Connected;
      temps.kelvin = TempUtils.resistanceToTemp(this.coefficients.A, this.coefficients.B, this.coefficients.C, resistance);  
      temps.celcius = TempUtils.kelvinToCelcius(temps.kelvin);
      temps.farenheight = TempUtils.celciusToFarenheight(temps.celcius);
    }

    return temps;
  }
}
