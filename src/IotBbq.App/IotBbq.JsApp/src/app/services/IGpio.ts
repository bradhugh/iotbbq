import { InjectionToken } from '@angular/core';

export enum InOrOut {
  In,
  Out
}

export enum PinValue {
  Low = 0,
  High = 1,
}

export interface IGpioFactory {
  open(pin: number, inOrOut: InOrOut): IGpio;
}

export interface IGpio {
  write(value: PinValue): void;
  close();
}

export const GPIO_FACTORY_TOKEN = new InjectionToken('GPIO_FACTORY_TOKEN');