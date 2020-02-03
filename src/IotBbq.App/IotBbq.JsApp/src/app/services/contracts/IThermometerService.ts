import { InjectionToken } from '@angular/core';

export const THERM_SVC_TOKEN = new InjectionToken<IThermometerService>('THERM_SVC_TOKEN');

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

export interface IThermometerService {
  readThermometer(probeNumber: number): Promise<ITemps>;
}
