import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { IBbqItem } from '../../services/BbqItem';
import { IBbqEvent } from '../../services/BbqEvent';
import { BbqItemComponent } from '../bbq-item/bbq-item.component';
import { ActivatedRoute } from '@angular/router';
import { IDataStorage, DATA_STORAGE_TOKEN } from '../../services/IDataStorage';
import { ItemEditorService } from '../../services/ItemEditorService';
import { Utility } from '../../services/Utility';
import { ItemLoggerService } from '../../services/ItemLoggerService';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: [ './cook.component.scss' ]
})
export class CookComponent implements OnInit, OnDestroy {

  public items: IBbqItem[] = [];

  public event: IBbqEvent;

  private eventId: string = null;

  constructor(
    private activatedroute: ActivatedRoute,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    private itemEditor: ItemEditorService,
    private itemLogger: ItemLoggerService,
  ) {
  }

  ngOnInit() {
    this.activatedroute.params.subscribe(async (params) => {
      this.eventId = params['id'];

      this.event = await this.dataStorage.getEventById(this.eventId);
      this.items = await this.dataStorage.getItems(this.eventId);

      this.itemLogger.start(this.eventId);
    });
  }

  ngOnDestroy(): void {
    this.itemLogger.stop();
  }

  public async addItemClicked() {
    // Create the new item
    const newItem = await this.itemEditor.editItem(this.eventId, null);
    this.items.push(newItem);
  }

  public async editItemClicked() {
    const selected = BbqItemComponent.getSelected();
    if (selected) {
      console.log(`Edit item ${selected.item.name}`);
      await this.itemEditor.editItem(this.eventId, selected.item);
    } else {
      console.log('No item selected');
    }
  }
}
