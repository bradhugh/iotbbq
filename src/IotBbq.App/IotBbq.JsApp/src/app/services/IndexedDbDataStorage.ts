import { IDataStorage } from './IDataStorage';
import { IBbqEvent } from './BbqEvent';
import { IBbqItem } from './BbqItem';

export class IndexedDbDataStorage implements IDataStorage {

  private static dbName = 'IotBbqDb';

  public db: IDBDatabase;

  getEventById(eventId: string): IBbqEvent {
    throw new Error('Method not implemented.');
  }
  getEvents(): IBbqEvent[] {
    throw new Error('Method not implemented.');
  }
  insertEvent(event: IBbqEvent): void {
    throw new Error('Method not implemented.');
  }
  getItems(eventId: string): IBbqItem[] {
    throw new Error('Method not implemented.');
  }
  insertItem(item: IBbqItem): void {
    throw new Error('Method not implemented.');
  }

  private openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = window.indexedDB.open(IndexedDbDataStorage.dbName);
      req.onsuccess = (ev: any) => {
        resolve(ev.target.result as IDBDatabase);
      };

      req.onerror = (ev: any) => {
        reject(ev.target.result);
      };
    });
  }
}
