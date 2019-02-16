/// <reference types="@types/winrt-uwp" />

import { Utility } from '../Utility';
import { AlarmServiceBase } from '../AlarmServiceBase';

export class UwpAlarmService extends AlarmServiceBase {

  private gpio: Windows.Devices.Gpio.GpioController = null;

  private pinToBuzz: Windows.Devices.Gpio.GpioPin = null;

  constructor() {
    super();

    this.gpio = Windows.Devices.Gpio.GpioController.getDefault();

    this.pinToBuzz = this.gpio.openPin(16, Windows.Devices.Gpio.GpioSharingMode.exclusive);
    this.pinToBuzz.setDriveMode(Windows.Devices.Gpio.GpioPinDriveMode.output);

    // Make sure we start low
    this.pinToBuzz.write(Windows.Devices.Gpio.GpioPinValue.low);
  }

  protected async doOneBeep(durationInMs: number): Promise<void> {
    this.pinToBuzz.write(Windows.Devices.Gpio.GpioPinValue.high);
    await Utility.sleep(durationInMs);
    this.pinToBuzz.write(Windows.Devices.Gpio.GpioPinValue.low);
  }
}
