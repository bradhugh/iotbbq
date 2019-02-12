import { Component, OnInit } from '@angular/core';
import { IBbqItem } from '../../services/BbqItem';
import { IBbqEvent } from '../../services/BbqEvent';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: [ './cook.component.scss' ]
})
export class CookComponent implements OnInit {

  public items: IBbqItem[] = [];

  public event: IBbqEvent;

  constructor() { }

  ngOnInit() {

    this.event = {
      id: '1',
      eventDate: new Date('2019-02-11'),
      name: 'Bbq Country Classic',
      turnInTime: new Date('2019-02-11T22:00:00Z'),
    };

    this.items.push({
      id: '1',
      eventId: '1',
      name: 'Item 1',
      cookStartTime: new Date('2019-02-11'),
      currentPhase: 'On Smoker',
      targetTemperature: 190,
      temperature: 140,
      thermometerIndex: 1,
      weight: 10
    });

    this.items.push({
      id: '2',
      eventId: '1',
      name: 'Item 2',
      cookStartTime: new Date('2019-02-11'),
      currentPhase: 'On Smoker',
      targetTemperature: 190,
      temperature: 110,
      thermometerIndex: 2,
      weight: 10
    });

    this.items.push({
      id: '3',
      eventId: '1',
      name: 'Item 3',
      cookStartTime: new Date('2019-02-11'),
      currentPhase: 'On Smoker',
      targetTemperature: 190,
      temperature: 120,
      thermometerIndex: 3,
      weight: 10
    });

    this.items.push({
      id: '4',
      eventId: '1',
      name: 'Item 4',
      cookStartTime: new Date('2019-02-11'),
      currentPhase: 'On Smoker',
      targetTemperature: 190,
      temperature: 80,
      thermometerIndex: 4,
      weight: 10
    });
  }

}
