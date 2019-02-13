import { Component, OnInit, Input } from '@angular/core';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  private static msPerSecond = 1000;

  private static msPerMinute = CountdownComponent.msPerSecond * 60;

  private static msPerHour = CountdownComponent.msPerMinute * 60;

  public timeTillTurnIn: string = null;

  private timer: Observable<number> = null;

  @Input() public dueTime: Date;

  constructor() { }

  ngOnInit() {
    this.timer = timer(0, 1000);
    this.timer.subscribe(() => {
      if (this.dueTime) {
        const now = new Date();
        let delta = this.dueTime.getTime() - now.getTime();

        const isnegative = delta < 0;
        delta = Math.abs(delta);

        let hours = Math.floor(delta / CountdownComponent.msPerHour);
        delta -= hours * CountdownComponent.msPerHour;

        if (isnegative) {
          hours *= -1;
        }

        const minutes = Math.floor(delta / CountdownComponent.msPerMinute);
        delta -= minutes * CountdownComponent.msPerMinute;

        const seconds = Math.floor(delta / CountdownComponent.msPerSecond);

        this.timeTillTurnIn = `${hours}:${minutes}:${seconds}`;
      }
    });
  }
}
