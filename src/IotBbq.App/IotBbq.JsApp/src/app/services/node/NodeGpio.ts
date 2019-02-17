
const electron = require('electron').remote;
const onoff = electron.require('onoff');

import { InOrOut, IGpioFactory, IGpio, PinValue } from '../IGpio';

export class NodeGpio implements IGpio {

  private pin: any;

  constructor(pin: number, inOrOut: InOrOut) {
    this.pin = new onoff.Gpio(pin, inOrOut === InOrOut.In ? 'in' : 'out');
  }

  public async write(value: PinValue): Promise<void> {
    this.pin.writeSync(value);
  }

  public async close(): Promise<void> {
    this.pin.writeSync(PinValue.Low);
    this.pin.unexport();
  }
}

export class NodeGpioFactory implements IGpioFactory {
  open(pin: number, inOrOut: InOrOut): NodeGpio {
    return new NodeGpio(pin, inOrOut);
  }
}
