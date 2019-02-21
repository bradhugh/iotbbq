import { InOrOut, IGpioFactory, IGpio, PinValue } from '../contracts/IGpio';
import { XPlatService } from '../XPlatService';
import { Gpio } from 'onoff';

export class NodeGpio implements IGpio {

  private pin: Gpio;

  constructor(xplat: XPlatService, pin: number, inOrOut: InOrOut) {
    this.pin = new xplat.onoff.Gpio(pin, inOrOut === InOrOut.In ? 'in' : 'out');
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

  constructor(private xplat: XPlatService) {
    if (xplat.isElectron() && xplat.isArm()) {
      xplat.onoff = xplat.remote.require('onoff');
    }
  }

  open(pin: number, inOrOut: InOrOut): NodeGpio {
    return new NodeGpio(this.xplat, pin, inOrOut);
  }
}
