import { IBbqEvent } from './BbqEvent';
import { IBbqItem } from './BbqItem';
import { InjectionToken } from '@angular/core';

export interface IDataStorage {
  getEventById(eventId: string): Promise<IBbqEvent>;
  getEvents(): Promise<IBbqEvent[]>;
  insertEvent(event: IBbqEvent): Promise<void>;

  getItems(eventId: string): Promise<IBbqItem[]>;
  insertItem(item: IBbqItem): Promise<void>;
}

export const DATA_STORAGE_TOKEN = new InjectionToken<IDataStorage>('DATA_STORAGE_TOKEN');
