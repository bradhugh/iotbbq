import { IBbqEvent } from '../../model/BbqEvent';
import { IBbqItem } from '../../model/BbqItem';
import { InjectionToken } from '@angular/core';
import { IBbqItemLog } from '../../model/BbqItemLog';
import { ISmokerLog } from '../../model/SmokerLog';
import { ISmokerSettings } from '../../model/SmokerSettings';

export interface IDataStorage {
  getEventById(eventId: string): Promise<IBbqEvent>;
  getEvents(): Promise<IBbqEvent[]>;
  insertEvent(event: IBbqEvent): Promise<void>;
  updateEvent(event: IBbqEvent): Promise<void>;

  getItems(eventId: string): Promise<IBbqItem[]>;
  insertItem(item: IBbqItem): Promise<void>;
  updateItem(item: IBbqItem): Promise<void>;

  insertItemLog(itemLog: IBbqItemLog): Promise<void>;

  forEachItemLog(
    eventId: string,
    forEach: (log: IBbqItemLog, current: number, total: number) => void,
    itemId?: string,
    minTime?: Date,
    maxTime?: Date,
    lowerBoundExclusive?: boolean,
    upperBoundExclusive?: boolean,
    maxCount?: number): Promise<void>;

  insertSmokerLog(smokerLog: ISmokerLog): Promise<void>;

  forEachSmokerLog(
    eventId: string,
    forEach: (log: ISmokerLog, current: number, total: number) => void,
    minTime?: Date,
    maxTime?: Date,
    lowerBoundExclusive?: boolean,
    upperBoundExclusive?: boolean,
    maxCount?: number): Promise<void>;

  getSmokerSettings(): Promise<ISmokerSettings>;
  setSmokerSettings(settings: ISmokerSettings): Promise<void>;
}

export const DATA_STORAGE_TOKEN = new InjectionToken<IDataStorage>('DATA_STORAGE_TOKEN');
