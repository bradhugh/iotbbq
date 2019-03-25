import { Component, OnInit, Input, Inject } from '@angular/core';
import { ISmokerModel } from '../../model/SmokerSettings';
import { SmokerEditorService } from '../../services/SmokerEditorService';
import { Observable, timer } from 'rxjs';
import { ThermometerService, ThermometerState } from '../../services/ThermometerService';
import { AlarmService, AlarmPriority } from '../../services/AlarmService';
import { IDataStorage, DATA_STORAGE_TOKEN } from '../../services/contracts/IDataStorage';

@Component({
  selector: 'app-smoker',
  templateUrl: './smoker.component.html',
  styleUrls: [ './smoker.component.scss' ]
})
export class SmokerComponent implements OnInit {

  public model: ISmokerModel = {
    highGate: 0,
    lowGate: 0,
    setTo: 0,
    temperature: 0
  };

  public isAlarming = false;

  public isDisconnected = false;

  public isMuted = true;

  private muteExpires: Date = new Date();

  private alarmMuteDurationInMs = 1000 * 60 * 10;

  private initialMuteDuration = 1000 * 60 * 5;

  private refreshTimer: Observable<number> = null;

  private probeIndex = 7;

  constructor(
    private smokerEditor: SmokerEditorService,
    private thermometer: ThermometerService,
    private alarmService: AlarmService,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    ) { }

  async ngOnInit() {
    const settings = await this.dataStorage.getSmokerSettings();
    if (settings) {
      this.model.setTo = settings.setTo;
      this.model.highGate = settings.highGate;
      this.model.lowGate = settings.lowGate;
    }

    this.refreshTimer = timer(0, 1000);
    this.refreshTimer.subscribe(async () => await this.onRefreshTimerTick());

    // mute the alarm right away for an initial period
    this.isMuted = true;
    this.muteExpires = new Date(new Date().getTime() + this.initialMuteDuration);

    // Subscribe to alarm state changes
    this.alarmService.on('alarmSilenced', (tags: Object[]) => {
      // Someone silenced an alarm triggered by the smoker
      if (tags.indexOf(this.model) !== -1) {
        // Set new expiration time for mute
        const now = new Date();
        this.muteExpires = new Date(now.getTime() + this.alarmMuteDurationInMs);
        this.isMuted = true;
      }
    });
  }

  public async onSmokerComponentClicked() {
    await this.smokerEditor.editSettings(this.model);
  }

  private async onRefreshTimerTick(): Promise<void> {
    const temps = await this.thermometer.readThermometer(this.probeIndex - 1);
    if (temps.state === ThermometerState.Disconnected) {
      this.model.temperature = null;
      this.isDisconnected = true;
      return;
    }

    this.model.temperature = temps.farenheight;
    this.isDisconnected = false;

    if (this.model.temperature >= this.model.highGate || this.model.temperature < this.model.lowGate) {
      this.setAlarmState();
    } else {
      this.clearAlarmState();
    }

    this.updateMuteState();
  }

  private updateMuteState() {
    const now = new Date();

    // If we've reached the time for the mute to expire, clear isMuted
    if (now >= this.muteExpires) {
      this.isMuted = false;
    }
  }

  private clearAlarmState() {
    this.isAlarming = false;
  }

  private setAlarmState() {
    if (!this.isAlarming) {
      this.isAlarming = true;

      const now = new Date();
      if (now >= this.muteExpires) {
        this.alarmService.triggerAlarm(AlarmPriority.Normal, this.model);
      }
    }
  }
}
