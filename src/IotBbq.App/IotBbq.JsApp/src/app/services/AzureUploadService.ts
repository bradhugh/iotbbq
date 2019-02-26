import { Observable, Subscription, timer } from 'rxjs';
import { Inject } from '@angular/core';
import { DATA_STORAGE_TOKEN, IDataStorage } from './contracts/IDataStorage';
import { Utility } from './Utility';
import { IBbqItem } from '../model/BbqItem';
import { IBbqEvent } from '../model/BbqEvent';
import { IBbqItemLog } from '../model/BbqItemLog';
import { ISmokerLog } from '../model/SmokerLog';
import { HttpClient } from '@angular/common/http';

interface ItemLoggingRequest {
  event: IBbqEvent;
  item: IBbqItem;
  itemLogs: IBbqItemLog[];
}

interface SmokerLoggingRequest {
  event: IBbqEvent;
  smokerLogs: ISmokerLog[];
}

export class AzureUploadService {

  private logInterval = 1000 * 60 * 5; // 5 minutes

  private initialDelay = 1000 * 5; // 5 seconds

  private azureLogTimer: Observable<number> = null;

  private eventId: string = null;

  private timerSubscription: Subscription = null;

  private uploadServiceBaseUri = 'https://hamdall.azurewebsites.net/';

  // private uploadServiceBaseUri = 'https://localhost:44315/';

  private logItemsPath = 'api/logging/logitems';

  private logSmokerPath = 'api/logging/logsmoker';

  constructor(
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    private httpClient: HttpClient,
  ) {}

  public start(eventId: string) {
    this.eventId = eventId;

    this.azureLogTimer = timer(this.initialDelay, this.logInterval);
    this.timerSubscription = this.azureLogTimer.subscribe(async () => await this.onTimerTick());
  }

  public stop() {
    this.timerSubscription.unsubscribe();
    this.eventId = null;
    this.azureLogTimer = null;
  }

  private async onTimerTick(): Promise<void> {
    const event = await this.dataStorage.getEventById(this.eventId);

    await this.uploadSmokerLogs(event);
    await this.uploadItemLogs(event);
  }

  private async uploadSmokerLogs(event: IBbqEvent): Promise<void> {

    const smokerLogs: ISmokerLog[] = [];
    let maxTimestamp = Utility.MinDate;
    await this.dataStorage.forEachSmokerLog(
      event.id,
      (log, _current, _total) => {
        smokerLogs.push(log);
        maxTimestamp = log.timestamp > maxTimestamp ? log.timestamp : maxTimestamp;
      },
      event.lastSmokerUploadTime ? event.lastSmokerUploadTime : Utility.MinDate,
      Utility.MaxDate,
      true);

    // If for some reason there are no logs, do nothing
    if (smokerLogs.length === 0) {
      return;
    }

    const request: SmokerLoggingRequest = {
      event: event,
      smokerLogs: smokerLogs
    };

    try {
      // Try to upload the logs
      await this.httpClient.post(
        this.uploadServiceBaseUri + this.logSmokerPath,
        request, {
          headers: { 'Content-Type': 'application/json' }
        }).toPromise();

      // Udate the last update time
      event.lastSmokerUploadTime = maxTimestamp;
      await this.dataStorage.updateEvent(event);
    } catch (error) {
      console.log(`Failed to upload smoker logs. We will retry.`);
    }
  }

  private async uploadItemLogs(event: IBbqEvent): Promise<void> {
    const items: IBbqItem[] = await this.dataStorage.getItems(event.id);

    for (const item of items) {

      // Collect all the item logs for this item from the last upload time
      const itemLogs: IBbqItemLog[] = [];
      let maxTimestamp = Utility.MinDate;
      await this.dataStorage.forEachItemLog(
        event.id,
        (log, _current, _total) => {
          itemLogs.push(log);
          maxTimestamp = log.timestamp > maxTimestamp ? log.timestamp : maxTimestamp;
        },
        item.id,
        item.lastLogUploadTime ? item.lastLogUploadTime : Utility.MinDate,
        Utility.MaxDate,
        true);

      if (itemLogs.length === 0) {
        continue;
      }

      const request: ItemLoggingRequest = {
        event: event,
        item: item,
        itemLogs: itemLogs
      };

      try {
        // Try to upload the logs
        await this.httpClient.post(
          this.uploadServiceBaseUri + this.logItemsPath,
          request, {
            headers: { 'Content-Type': 'application/json' }
          }).toPromise();

        // Udate the last update time
        item.lastLogUploadTime = maxTimestamp;
        await this.dataStorage.updateItem(item);
        console.log(`Item logs uploaded last timestamp ${maxTimestamp}`);
      } catch (error) {
        console.log(`Failed to upload item logs. We will retry.`);
      }
    }
  }
}
