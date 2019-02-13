import { Component, OnInit } from '@angular/core';
import { IBbqItem } from '../../services/BbqItem';
import { IBbqEvent } from '../../services/BbqEvent';
import { BbqItemComponent } from '../bbq-item/bbq-item.component';

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
      targetTemperature: 70,
      temperature: 0,
      thermometerIndex: 1,
      weight: 10
    });

    this.items.push({
      id: '2',
      eventId: '1',
      name: 'Item 2',
      cookStartTime: new Date('2019-02-11'),
      currentPhase: 'On Smoker',
      targetTemperature: 70,
      temperature: 0,
      thermometerIndex: 2,
      weight: 10
    });

    this.items.push({
      id: '3',
      eventId: '1',
      name: 'Item 3',
      cookStartTime: new Date('2019-02-11'),
      currentPhase: 'On Smoker',
      targetTemperature: 70,
      temperature: 0,
      thermometerIndex: 3,
      weight: 10
    });

    this.items.push({
      id: '4',
      eventId: '1',
      name: 'Item 4',
      cookStartTime: new Date('2019-02-11'),
      currentPhase: 'On Smoker',
      targetTemperature: 70,
      temperature: 0,
      thermometerIndex: 4,
      weight: 10
    });
  }

  public editItemClicked() {
    const selected = BbqItemComponent.getSelected();
    if (selected) {
      console.log(`Edit item ${selected.item.name}`);
    } else {
      console.log('No item selected');
    }
  }
}
