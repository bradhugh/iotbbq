import { IGpio, PinValue, InOrOut, IGpioFactory } from '../contracts/IGpio';
import * as gpio from 'gpio';

export class SimpleGpio implements IGpio {

  private openTask: Promise<gpio.INpmGpio>;

  constructor(private pin: number, private inOrOut: InOrOut) {

    this.openTask = new Promise<gpio.INpmGpio>((resolve, reject) => {
      const gpioPin = gpio.export(pin, {
        direction: gpio.DIRECTION.OUT,
        interval: 10 * 60 * 1000,
        ready: () => resolve(gpioPin)
      });
    });
  }

  public async write(value: PinValue): Promise<void> {
    const gpioPin = await this.openTask;
    return new Promise<void>((resolve, reject) => {
      gpioPin.set(value === PinValue.High ? 1 : 0, resolve);
    });
  }

  public async close(): Promise<void> {
    const gpioPin = await this.openTask;
    gpioPin.unexport();
  }
}

export class SimpleGpioFactory implements IGpioFactory {
  open(pin: number, inOrOut: InOrOut): IGpio {
    return new SimpleGpio(pin, inOrOut);
  }
}
