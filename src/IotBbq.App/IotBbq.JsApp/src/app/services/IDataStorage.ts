import { IBbqEvent } from './BbqEvent';
import { IBbqItem } from './BbqItem';
import { InjectionToken } from '@angular/core';
import { IBbqItemLog } from './BbqItemLog';

export interface IDataStorage {
  getEventById(eventId: string): Promise<IBbqEvent>;
  getEvents(): Promise<IBbqEvent[]>;
  insertEvent(event: IBbqEvent): Promise<void>;

  getItems(eventId: string): Promise<IBbqItem[]>;
  insertItem(item: IBbqItem): Promise<void>;
  updateItem(item: IBbqItem): Promise<void>;

  insertItemLog(itemLog: IBbqItemLog): Promise<void>;
}

export const DATA_STORAGE_TOKEN = new InjectionToken<IDataStorage>('DATA_STORAGE_TOKEN');
