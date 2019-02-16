import { IGpio, PinValue, InOrOut, IGpioFactory } from '../IGpio';

export class NullGpio implements IGpio {

  constructor(private pin: number, private inOrOut: InOrOut) {
    console.log(`Opened GPIO pin ${pin} for mode ${InOrOut[inOrOut]}`);
  }

  write(value: PinValue): void {
    console.log(`GPIO write pin ${this.pin} with value '${PinValue[value]}'`);
  }

  close() {
    console.log(`closing pin ${this.pin} with mode ${InOrOut[this.inOrOut]}`);
  }
}

export class NullGpioFactory implements IGpioFactory {
  open(pin: number, inOrOut: InOrOut): IGpio {
    return new NullGpio(pin, inOrOut);
  }
}
