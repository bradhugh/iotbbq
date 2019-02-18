import { Component, OnInit, Input, Inject } from '@angular/core';
import { ISmokerModel } from '../../model/SmokerSettings';
import { SmokerEditorService } from '../../services/SmokerEditorService';
import { IThermometerService, THERM_SVC_TOKEN } from '../../services/IThermometerService';
import { ALARM_SVC_TOKEN, IAlarmService, AlarmPriority } from '../../services/IAlarmService';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-smoker',
  templateUrl: './smoker.component.html',
  styleUrls: [ './smoker.component.scss' ]
})
export class SmokerComponent implements OnInit {

  public model: ISmokerModel = {
    highGate: 0,
    lowGate: 0,
    temperature: 0
  };

  public isAlarming = false;

  private alarmDelay = 1000; // * 60 * 5;

  private loadedTime: Date;

  private refreshTimer: Observable<number> = null;

  private probeIndex = 7;

  constructor(
    private smokerEditor: SmokerEditorService,
    @Inject(THERM_SVC_TOKEN) private thermometer: IThermometerService,
    @Inject(ALARM_SVC_TOKEN) private alarmService: IAlarmService,
    ) { }

  ngOnInit() {
    const settings = window.localStorage.getItem('smokerSettings');
    if (settings) {
      this.model = JSON.parse(settings);
      this.model.temperature = 0;
    }

    this.refreshTimer = timer(0, 1000);
    this.refreshTimer.subscribe(async () => await this.onRefreshTimerTick());

    this.loadedTime = new Date();
  }

  public async onSmokerComponentClicked() {
    await this.smokerEditor.editSettings(this.model);
  }

  private async onRefreshTimerTick(): Promise<void> {
    const temps = await this.thermometer.readThermometer(this.probeIndex - 1);
    this.model.temperature = temps.farenheight;

    if (this.model.temperature >= this.model.highGate
      || this.model.temperature < this.model.lowGate) {
        const now = new Date();
        if (now.getTime() - this.loadedTime.getTime() > this.alarmDelay) {
          if (!this.isAlarming) {
            this.isAlarming = true;
            this.alarmService.triggerAlarm(AlarmPriority.Normal);
          }
        }
      } else {
        this.isAlarming = false;
      }
  }
}
