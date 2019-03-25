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

  private alarmDelay = 1000; // * 60 * 5;

  private loadedTime: Date;

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

    this.loadedTime = new Date();
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

    if (this.model.temperature >= this.model.highGate
      || this.model.temperature < this.model.lowGate) {
        const now = new Date();
        if (now.getTime() - this.loadedTime.getTime() > this.alarmDelay) {
          if (!this.isAlarming) {
            this.isAlarming = true;
            this.alarmService.triggerAlarm(AlarmPriority.Normal, this.model);
          }
        }
      } else {
        this.isAlarming = false;
      }
  }
}
