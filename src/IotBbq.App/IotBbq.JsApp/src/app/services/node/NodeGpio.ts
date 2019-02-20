import { InOrOut, IGpioFactory, IGpio, PinValue } from '../IGpio';
import { ElectronService } from '../electron.service';
import { Gpio } from 'onoff';

let onoff: typeof import('onoff') = null;

export class NodeGpio implements IGpio {

  private pin: Gpio;

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

  constructor(electronService: ElectronService) {
    if (electronService.isElectron() && electronService.isArm()) {
      onoff = electronService.remote.require('onoff');
    }
  }

  open(pin: number, inOrOut: InOrOut): NodeGpio {
    return new NodeGpio(pin, inOrOut);
  }
}
