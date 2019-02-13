import { IBbqEvent } from './BbqEvent';
import { IBbqItem } from './BbqItem';
import { InjectionToken } from '@angular/core';

export interface IDataStorage {
  getEventById(eventId: string): IBbqEvent;
  getEvents(): IBbqEvent[];
  insertEvent(event: IBbqEvent): void;

  getItems(eventId: string): IBbqItem[];
  insertItem(item: IBbqItem): void;
}

export const DATA_STORAGE_TOKEN = new InjectionToken<IDataStorage>('DATA_STORAGE_TOKEN');
