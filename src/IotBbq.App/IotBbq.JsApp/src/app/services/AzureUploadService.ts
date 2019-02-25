import { Observable, Subscription, timer } from 'rxjs';
import { Inject } from '@angular/core';
import { DATA_STORAGE_TOKEN, IDataStorage } from './contracts/IDataStorage';
import * as moment from 'moment';
import { Utility } from './Utility';
import { IBbqItem } from '../model/BbqItem';

export class AzureUploadService {

  private logInterval = 1000 * 5; // * 60 * 5;

  private azureLogTimer: Observable<number> = null;

  private eventId: string = null;

  private timerSubscription: Subscription = null;

  private lastSmokerLogTimestamp: Date = Utility.MinDate;
  private lastItemLogTimestamp: Date = Utility.MinDate;

  constructor(
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
  ) {}

  public start(eventId: string) {
    this.eventId = eventId;

    this.azureLogTimer = timer(0, this.logInterval);
    this.timerSubscription = this.azureLogTimer.subscribe(async () => await this.onTimerTick());
  }

  public stop() {
    this.timerSubscription.unsubscribe();
    this.eventId = null;
    this.azureLogTimer = null;
  }

  private async onTimerTick(): Promise<void> {
    this.dataStorage.forEachSmokerLog(
      this.eventId,
      (log, current, _total) => {
        console.log(`SmokerLog: id=${log.id}, ev=${log.eventId}, ts=${log.timestamp}`);
        if (log.timestamp > this.lastSmokerLogTimestamp) {
          this.lastSmokerLogTimestamp = log.timestamp;
        }
      },
      this.lastSmokerLogTimestamp,
      Utility.MaxDate,
      true);

    const items: IBbqItem[] = await this.dataStorage.getItems(this.eventId);
    for (const item of items) {
      this.dataStorage.forEachItemLog(
        this.eventId,
        (log, current, _total) => {
          console.log(`ItemLog: id=${log.id}, ev=${log.eventId}, iid=${log.bbqItemId} ts=${log.timestamp}`);
          if (log.timestamp > this.lastItemLogTimestamp) {
            this.lastItemLogTimestamp = log.timestamp;
          }
        },
        item.id,
        this.lastItemLogTimestamp,
        Utility.MaxDate,
        true);
    }
  }
}
