import { IBbqEvent } from '../model/BbqEvent';
import { IBbqItem } from '../model/BbqItem';
import { InjectionToken } from '@angular/core';
import { IBbqItemLog } from '../model/BbqItemLog';

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
