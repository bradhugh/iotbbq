import { InOrOut, IGpioFactory, IGpio, PinValue } from '../IGpio';
import { ElectronService } from '../electron.service';
import { Gpio } from 'onoff';

export class NodeGpio implements IGpio {

  private pin: Gpio;

  constructor(electron: ElectronService, pin: number, inOrOut: InOrOut) {
    this.pin = new electron.onoff.Gpio(pin, inOrOut === InOrOut.In ? 'in' : 'out');
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

  constructor(private electronService: ElectronService) {
    if (electronService.isElectron() && electronService.isArm()) {
      electronService.onoff = electronService.remote.require('onoff');
    }
  }

  open(pin: number, inOrOut: InOrOut): NodeGpio {
    return new NodeGpio(this.electronService, pin, inOrOut);
  }
}
