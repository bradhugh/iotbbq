import { Component, OnInit, Input, Inject } from '@angular/core';
import { IBbqItem } from '../../model/BbqItem';
import { Observable, timer } from 'rxjs';
import { PhaseChooserService } from '../../services/PhaseChooserService';
import { IDataStorage, DATA_STORAGE_TOKEN } from '../../services/contracts/IDataStorage';
import { TimeSpan } from '../../services/TimeSpan';
import { AlarmService, AlarmPriority } from '../../services/AlarmService';
import { ThermometerService, ThermometerState } from '../../services/ThermometerService';

@Component({
  selector: 'app-bbq-item',
  templateUrl: './bbq-item.component.html',
  styleUrls: [ './bbq-item.component.scss' ]
})
export class BbqItemComponent implements OnInit {

  public static selectedItem: BbqItemComponent = null;

  @Input() public item: IBbqItem;

  public isAlarming = false;

  private timer: Observable<number>;

  public isSelected = false;

  public cookElapsed = new TimeSpan(0);

  public isDisconnected = false;

  constructor(
    private thermometerService: ThermometerService,
    private alarmService: AlarmService,
    private phaseChooserService: PhaseChooserService,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
  ) {

    this.timer = timer(0, 1000);
    this.timer.subscribe(async () => await this.onTempRefreshTimer());
  }

  public static getSelected() {
    return BbqItemComponent.selectedItem;
  }

  ngOnInit() {
  }

  public async nextPhaseClicked(event: Event) {
    event.stopPropagation();

    // Not sure I need to acually do much here
    const nextPhase = await this.phaseChooserService.chooseNextPhase(this.item);

    // Phase has changes
    if (nextPhase && nextPhase.name !== this.item.currentPhase) {

      this.item.currentPhase = nextPhase.name;

      // If we've hit the first cooking phase, set a start time on the item
      if (!this.item.cookStartTime && nextPhase.isCooking) {
        this.item.cookStartTime = new Date();
      }

      // Save changes to the item with the new phase
      this.dataStorage.updateItem(this.item);
    }
  }

  public itemClicked() {
    const wasSelected = BbqItemComponent.selectedItem;
    if (wasSelected) {
      wasSelected.isSelected = false;
    }

    BbqItemComponent.selectedItem = this;
    this.isSelected = true;
  }

  private async onTempRefreshTimer(): Promise<void> {

    if (!this.item || this.item.thermometerIndex <= 0) {
      return;
    }

    const temps = await this.thermometerService.readThermometer(this.item.thermometerIndex - 1);

    // If the probe state is disconnected, set temperature to null
    if (temps.state === ThermometerState.Disconnected) {
      this.item.temperature = null;
      this.isDisconnected = true;
      return;
    }

    this.item.temperature = temps.farenheight;
    this.isDisconnected = false;

    if (this.item.temperature >= this.item.targetTemperature) {
      this.setAlarmState();
    } else {
      this.clearAlarmState();
    }

    // Go ahead and update the elapsed cook time if it is started
    if (this.item.cookStartTime) {
      const now = new Date();
      this.cookElapsed = TimeSpan.Subtract(now, this.item.cookStartTime);
    }
  }

  private clearAlarmState() {
    this.isAlarming = false;
  }

  private setAlarmState() {
    if (!this.isAlarming) {
      this.isAlarming = true;
      this.alarmService.triggerAlarm(AlarmPriority.Normal);
    }
  }
}
