import { Component, OnInit, Input, Inject } from '@angular/core';
import { IBbqItem } from '../../model/BbqItem';
import { THERM_SVC_TOKEN, IThermometerService } from '../../services/IThermometerService';
import { Observable, timer } from 'rxjs';
import { ALARM_SVC_TOKEN, IAlarmService, AlarmPriority } from '../../services/IAlarmService';

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

  constructor(
    @Inject(THERM_SVC_TOKEN) private thermometerService: IThermometerService,
    @Inject(ALARM_SVC_TOKEN) private alarmService: IAlarmService,
  ) {

    this.timer = timer(0, 10000);
    this.timer.subscribe(async () => await this.onTempRefreshTimer());
  }

  public static getSelected() {
    return BbqItemComponent.selectedItem;
  }

  ngOnInit() {
  }

  public nextPhaseClicked(event: Event) {
    event.stopPropagation();
    alert('Next Phase');
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

    if (this.item && this.item.thermometerIndex > 0) {
      const temps = await this.thermometerService.readThermometer(this.item.thermometerIndex);
      this.item.temperature = temps.farenheight;

      if (this.item.temperature >= this.item.targetTemperature) {
        this.setAlarmState();
      } else {
        this.clearAlarmState();
      }
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
