import { Inject } from '@angular/core';
import { IDataStorage, DATA_STORAGE_TOKEN } from './IDataStorage';
import { timer, Observable } from 'rxjs';
import { IBbqItemLog } from '../model/BbqItemLog';
import { THERM_SVC_TOKEN, IThermometerService } from './IThermometerService';
import { Utility } from './Utility';

export class ItemLoggerService {

  private logInterval = 1000 * 60;

  private itemLogTimer: Observable<number> = null;

  private eventId: string = null;

  constructor(
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    @Inject(THERM_SVC_TOKEN) private thermometerService: IThermometerService) {

  }

  public start(eventId: string) {
    this.eventId = eventId;

    this.itemLogTimer = timer(0, this.logInterval);
    this.itemLogTimer.subscribe(async () => await this.onTimerTick());
  }

  public stop() {
    this.eventId = null;
    this.itemLogTimer = null;
  }

  private async onTimerTick(): Promise<void> {
    const currentEventId = this.eventId;
    if (!currentEventId) {
      return;
    }

    const items = await this.dataStorage.getItems(currentEventId);
    const timeStamp = new Date();

    for (const item of items) {
      const log: IBbqItemLog = {
        id: Utility.createGuid(),
        eventId: currentEventId,
        bbqItemId: item.id,
        currentPhase: item.currentPhase,
        itemName: item.name,
        temperature: 0,
        thermometer: item.thermometerIndex,
        timestamp: timeStamp
      };

      const temps = await this.thermometerService.readThermometer(item.thermometerIndex);

      // TODO: Handle invalid values
      log.temperature = temps.farenheight;

      await this.dataStorage.insertItemLog(log);
    }
  }
}
