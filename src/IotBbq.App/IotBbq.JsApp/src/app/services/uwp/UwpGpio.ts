/// <reference types="@types/winrt-uwp" />

import { IGpio, PinValue, InOrOut, IGpioFactory } from '../IGpio';

export class UwpGpio implements IGpio {

  private controller = Windows.Devices.Gpio.GpioController.getDefault();
  private pin: Windows.Devices.Gpio.GpioPin = null;

  constructor(pin: number, inOrOut: InOrOut) {
    this.pin = this.controller.openPin(pin, Windows.Devices.Gpio.GpioSharingMode.exclusive);
    this.pin.setDriveMode(inOrOut === InOrOut.In
      ? Windows.Devices.Gpio.GpioPinDriveMode.output : Windows.Devices.Gpio.GpioPinDriveMode.output);

    // Make sure we start low
    this.pin.write(Windows.Devices.Gpio.GpioPinValue.low);
  }

  public async write(value: PinValue): Promise<void> {
    const pinValue = value === PinValue.Low ? Windows.Devices.Gpio.GpioPinValue.low : Windows.Devices.Gpio.GpioPinValue.high;
    this.pin.write(pinValue);
  }

  public async close(): Promise<void> {
    this.pin.close();
  }
}

export class UwpGpioFactory implements IGpioFactory {
  open(pin: number, inOrOut: InOrOut): IGpio {
    return new UwpGpio(pin, inOrOut);
  }
}
