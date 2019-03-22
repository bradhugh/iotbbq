import { Inject } from '@angular/core';
import { IDataStorage, DATA_STORAGE_TOKEN } from './contracts/IDataStorage';
import { timer, Observable, Subscription } from 'rxjs';
import { IBbqItemLog } from '../model/BbqItemLog';
import { Utility } from './Utility';
import { ThermometerService } from './ThermometerService';
import { ISmokerLog } from '../model/SmokerLog';

export class ItemLoggerService {

  private logInterval = 1000 * 60;

  private itemLogTimer: Observable<number> = null;

  private eventId: string = null;

  private smokerProbeIndex = 6;

  private timerSubscription: Subscription = null;

  constructor(
    @Inject(DATA_STORAGE_TOKEN) private dataStorage: IDataStorage,
    private thermometerService: ThermometerService) {

  }

  public start(eventId: string) {
    this.eventId = eventId;

    this.itemLogTimer = timer(0, this.logInterval);
    this.timerSubscription = this.itemLogTimer.subscribe(async () => await this.onTimerTick());
  }

  public stop() {
    this.timerSubscription.unsubscribe();
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
      const elapsed = item.cookStartTime ?
        (timeStamp.getTime() - item.cookStartTime.getTime()) / 1000 : 0;

      const log: IBbqItemLog = {
        id: Utility.createGuid(),
        eventId: currentEventId,
        bbqItemId: item.id,
        currentPhase: item.currentPhase,
        itemName: item.name,
        elapsedCookTime: elapsed,
        temperature: 0,
        thermometer: item.thermometerIndex,
        timestamp: timeStamp
      };

      const temps = await this.thermometerService.readThermometer(item.thermometerIndex);

      // TODO: Do we want to log thermometer state?
      log.temperature = temps.farenheight;

      await this.dataStorage.insertItemLog(log);
    }

    const smokerTemp = await this.thermometerService.readThermometer(this.smokerProbeIndex);

    const smokerSettings = await this.dataStorage.getSmokerSettings();

    // Smoker log
    const smokerLog: ISmokerLog = {
      id: Utility.createGuid(),
      timestamp: timeStamp,
      eventId: currentEventId,
      temperature: smokerTemp.farenheight,
      setTo: smokerSettings.setTo,
    };

    await this.dataStorage.insertSmokerLog(smokerLog);
  }
}
