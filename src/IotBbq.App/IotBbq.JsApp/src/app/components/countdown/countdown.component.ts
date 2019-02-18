import { Component, OnInit, Input } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { TimeSpan } from '../../services/TimeSpan';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  public timeTillTurnIn: TimeSpan = new TimeSpan(0);

  private timer: Observable<number> = null;

  @Input() public dueTime: Date;

  constructor() { }

  ngOnInit() {
    this.timer = timer(0, 1000);
    this.timer.subscribe(() => {
      if (this.dueTime) {
        const now = new Date();
        this.timeTillTurnIn = TimeSpan.Subtract(this.dueTime, now);
      }
    });
  }
}
