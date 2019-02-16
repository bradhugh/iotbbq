
import { IAlarmService, AlarmPriority } from './IAlarmService';
import { Utility } from './Utility';
import { Observable, Subscription, timer } from 'rxjs';

export class AlarmServiceBase implements IAlarmService {

  public alarmStateChanged: (state: boolean) => void = null;

  private _isAlarming = false;

  private whenToStop: Date = null;

  private normalPriorityInterval = 300;

  private highPriorityInterval = 150;

  private currentPriority: AlarmPriority = AlarmPriority.Normal;

  private alarmTimer: Observable<number> = null;

  private alarmSubscription: Subscription;

  constructor() {
  }

  public isAlarming(): boolean {
    return this._isAlarming;
  }

  public silence(): void {
    if (this.isAlarming()) {
      this.alarmSubscription.unsubscribe();
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
      this.alarmSubscription = this.alarmTimer.subscribe(async () => await this.onAlarmTimerTick());

      const cb = this.alarmStateChanged;
      if (cb) {
        cb(true);
      }
    }
  }

  protected async doOneBeep(durationInMs: number): Promise<void> {
    await Utility.sleep(durationInMs);
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
}
