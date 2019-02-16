/// <reference types="@types/winrt-uwp" />

import { IAlarmService, AlarmPriority } from '../IAlarmService';
import { Utility } from '../Utility';
import { Observable, timer } from 'rxjs';

export class UwpAlarmService implements IAlarmService {

  public alarmStateChanged: (state: boolean) => void = null;

  private _isAlarming = false;

  private gpio: Windows.Devices.Gpio.GpioController = null;

  private pinToBuzz: Windows.Devices.Gpio.GpioPin = null;

  private whenToStop: Date = null;

  private normalPriorityInterval = 300;

  private highPriorityInterval = 150;

  private currentPriority: AlarmPriority = AlarmPriority.Normal;

  private alarmTimer: Observable<number> = null;

  constructor() {
    this.gpio = Windows.Devices.Gpio.GpioController.getDefault();

    this.pinToBuzz = this.gpio.openPin(16, Windows.Devices.Gpio.GpioSharingMode.exclusive);
    this.pinToBuzz.setDriveMode(Windows.Devices.Gpio.GpioPinDriveMode.output);

    // Make sure we start low
    this.pinToBuzz.write(Windows.Devices.Gpio.GpioPinValue.low);
  }

  public isAlarming(): boolean {
    return this._isAlarming;
  }

  public silence(): void {
    if (this.isAlarming()) {
      this.alarmTimer = null;
      this._isAlarming = false;
      const cb = this.alarmStateChanged;
      if (cb) {
        cb(false);
      }
    }
  }

  public triggerAlarm(priority: AlarmPriority, duration: number = null) {
    if (!this.isAlarming() || (priority === AlarmPriority.High && this.currentPriority === AlarmPriority.Normal)) {
      const now = new Date();
      if (duration) {
        // TODO: confirm now.getTime() is in ms
        this.whenToStop = new Date(now.getTime() + duration);
      } else {
        this.whenToStop = null;
      }

      // Trigger the timer immediately
      this.currentPriority = priority;
      this._isAlarming = true;
      this.alarmTimer = timer(0, priority === AlarmPriority.High ? this.highPriorityInterval : this.normalPriorityInterval);
      const cb = this.alarmStateChanged;
      if (cb) {
        cb(true);
      }
    }
  }

  private async onAlarmTimerTick() {
    const now = new Date();
    if (this.whenToStop && now >= this.whenToStop) {
      this.silence();
      return;
    }

    // I think this is divided by 2 so there is an even space
    // between the tones when it is repeated
    await this.doOneBeep(this.normalPriorityInterval / 2);
  }

  private async doOneBeep(durationInMs: number): Promise<void> {
    this.pinToBuzz.write(Windows.Devices.Gpio.GpioPinValue.high);
    await Utility.sleep(durationInMs);
    this.pinToBuzz.write(Windows.Devices.Gpio.GpioPinValue.low);
  }
}
