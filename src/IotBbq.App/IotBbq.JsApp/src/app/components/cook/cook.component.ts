import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { IBbqItem } from '../../model/BbqItem';
import { IBbqEvent } from '../../model/BbqEvent';
import { BbqItemComponent } from '../bbq-item/bbq-item.component';
import { ActivatedRoute } from '@angular/router';
import { IDataStorage, DATA_STORAGE_TOKEN } from '../../services/contracts/IDataStorage';
import { ItemEditorService } from '../../services/ItemEditorService';
import { ItemLoggerService } from '../../services/ItemLoggerService';
import { AlarmService } from '../../services/AlarmService';
import { EXPORT_SERVICE_TOKEN, IExportService } from '../../services/contracts/IExportService';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: [ './cook.component.scss' ]
})
export class CookComponent implements OnInit, OnDestroy {

  public items: IBbqItem[] = [];

  public event: IBbqEvent;

  public isAlarming = false;

  private eventId: string = null;

  constructor(
    private activatedroute: ActivatedRoute,
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    private itemEditor: ItemEditorService,
    private itemLogger: ItemLoggerService,
    private alarmService: AlarmService,
    @Inject(EXPORT_SERVICE_TOKEN) private exportService: IExportService,
  ) {

    this.alarmService.alarmStateChanged = (s) => this.onAlarmStateChanged(s);
  }

  async ngOnInit() {
    const params = await this.activatedroute.params.pipe(first()).toPromise();
    this.eventId = params['id'];

    this.event = await this.dataStorage.getEventById(this.eventId);
    const items = await this.dataStorage.getItems(this.eventId);
    this.items = items.sort((a, b) => a.thermometerIndex - b.thermometerIndex);

    this.itemLogger.start(this.eventId);
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

  public async exportClicked() {
    const drives = await this.exportService.exportData(this.eventId);
  }

  public silenceButtonClicked() {
    this.alarmService.silence();
  }

  private onAlarmStateChanged(state: boolean): void {
    // REVIEW: Can't we just use the state here?
    if (this.alarmService.isAlarming()) {
      this.isAlarming = true;
    } else {
      this.isAlarming = false;
    }
  }
}
