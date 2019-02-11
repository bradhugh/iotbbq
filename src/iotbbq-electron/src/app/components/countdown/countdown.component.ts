import { Component, OnInit, Input } from '@angular/core';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  public timeTillTurnIn: string = null;

  private timer: Observable<number> = null;

  @Input() public dueTime: Date;

  constructor() { }

  ngOnInit() {
    this.timer = timer(0, 1000);
    this.timer.subscribe(() => {
      if (this.dueTime) {
        const now = new Date();
        const delta = new Date(now.getTime() - this.dueTime.getTime());
        this.timeTillTurnIn = `${delta.getHours()}:${delta.getMinutes()}:${delta.getSeconds()}`;
      }
    });
  }
}
