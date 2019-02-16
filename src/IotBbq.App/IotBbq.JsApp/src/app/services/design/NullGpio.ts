import { IGpio, PinValue, InOrOut, IGpioFactory } from '../IGpio';

export class NullGpio implements IGpio {

  constructor(private pin: number, private inOrOut: InOrOut) {
    console.log(`Opened GPIO pin ${pin} for mode ${InOrOut[inOrOut]}`);
  }

  public async write(value: PinValue): Promise<void> {
    console.log(`GPIO write pin ${this.pin} with value '${PinValue[value]}'`);
  }

  public async close(): Promise<void> {
    console.log(`closing pin ${this.pin} with mode ${InOrOut[this.inOrOut]}`);
  }
}

export class NullGpioFactory implements IGpioFactory {
  open(pin: number, inOrOut: InOrOut): IGpio {
    return new NullGpio(pin, inOrOut);
  }
}
