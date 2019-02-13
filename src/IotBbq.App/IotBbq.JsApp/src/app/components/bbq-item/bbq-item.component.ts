import { Component, OnInit, Input, Inject } from '@angular/core';
import { IBbqItem } from '../../services/BbqItem';
import { THERM_SVC_TOKEN, IThermometerService } from '../../services/IThermometerService';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-bbq-item',
  templateUrl: './bbq-item.component.html',
  styleUrls: [ './bbq-item.component.scss' ]
})
export class BbqItemComponent implements OnInit {

  @Input() public item: IBbqItem;

  public isAlarming: boolean = false;

  private timer: Observable<number>;

  constructor(
    @Inject(THERM_SVC_TOKEN) private thermometerService: IThermometerService
  ) {

    this.timer = timer(0, 10000);
    this.timer.subscribe(async () => {
      try {
        const temps = await this.thermometerService.readThermometer(0);

        if (this.item) {
          this.item.temperature = temps.farenheight;
          this.isAlarming = this.item.temperature >= this.item.targetTemperature;
        }

      } catch (err) {
        console.log(`Error ${err}`);
      }
    });
  }

  ngOnInit() {
  }

}
