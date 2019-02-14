import { Component, OnInit, Inject } from '@angular/core';
import { IBbqItem } from '../../services/BbqItem';
import { IBbqEvent } from '../../services/BbqEvent';
import { BbqItemComponent } from '../bbq-item/bbq-item.component';
import { ActivatedRoute } from '@angular/router';
import { IDataStorage, DATA_STORAGE_TOKEN } from '../../services/IDataStorage';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: [ './cook.component.scss' ]
})
export class CookComponent implements OnInit {

  public items: IBbqItem[] = [];

  public event: IBbqEvent;

  private eventId: string = null;

  constructor(
    activatedroute: ActivatedRoute,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
  ) {
      activatedroute.params.subscribe(async (params) => {
        this.eventId = params['id'];

        this.event = await this.dataStorage.getEventById(this.eventId);
        this.items = await this.dataStorage.getItems(this.eventId);
      });
  }

  ngOnInit() {
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
