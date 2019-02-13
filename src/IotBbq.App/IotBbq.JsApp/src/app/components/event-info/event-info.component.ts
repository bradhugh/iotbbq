import { Component, OnInit, Input } from '@angular/core';
import { IBbqEvent } from '../../services/BbqEvent';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: [ './event-info.component.scss' ]
})
export class EventInfoComponent implements OnInit {

  @Input() public event: IBbqEvent = null;

  public currentTime: Date;

  public timer: Observable<number>;

  ngOnInit() {
    this.timer = timer(0, 1000);
    this.timer.subscribe(() => {
      this.currentTime = new Date();
    });
  }
}
