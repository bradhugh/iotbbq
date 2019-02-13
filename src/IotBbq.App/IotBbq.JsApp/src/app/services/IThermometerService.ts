import { InjectionToken } from '@angular/core';

export interface ITemps {
  kelvin: number;
  celcius: number;
  farenheight: number;
}

export interface IThermometerService {
  readThermometer(index: number): Promise<ITemps>;
}

export const THERM_SVC_TOKEN: InjectionToken<IThermometerService> = new InjectionToken<IThermometerService>('THERM_SVC_TOKEN');
