import { IDataStorage } from './IDataStorage';
import { IBbqEvent } from '../model/BbqEvent';
import { IBbqItem } from '../model/BbqItem';
import { IBbqItemLog } from '../model/BbqItemLog';

export class IndexedDbDataStorage implements IDataStorage {

  private static dbName = 'IotBbqDb';
  private static eventsTableName = 'bbqEvents';
  private static itemsTableName = 'bbqItems';
  private static itemLogTableName = 'bbqItemLogs';

  public db: IDBDatabase = null;
  private opening = false;

  public async getEventById(eventId: string): Promise<IBbqEvent> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.eventsTableName ], 'readonly');
    return new Promise<IBbqEvent>((resolve, reject) => {
      const eventStore = transaction.objectStore(IndexedDbDataStorage.eventsTableName);
      const request = eventStore.get(eventId);
      request.onsuccess = () => resolve(request.result as IBbqEvent);
      request.onerror = () => reject(request.error);
    });
  }

  public async getEvents(): Promise<IBbqEvent[]> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.eventsTableName ], 'readonly');
    const eventStore = transaction.objectStore(IndexedDbDataStorage.eventsTableName);
    const cursorRequest = eventStore.openCursor();

    return new Promise<IBbqEvent[]>((resolve, reject) => {
      cursorRequest.onerror = () => reject(cursorRequest.error);

      const bbqEvents: IBbqEvent[] = [];
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          bbqEvents.push(cursor.value as IBbqEvent);
          cursor.continue();
        } else {
          resolve(bbqEvents);
        }
      };
    });
  }

  public async insertEvent(event: IBbqEvent): Promise<void> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.eventsTableName ], 'readwrite');
    const eventStore = transaction.objectStore(IndexedDbDataStorage.eventsTableName);
    const putRequest = eventStore.put(event);
    return new Promise<void>((resolve, reject) => {
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve();
    });
  }

  public async getItems(eventId: string): Promise<IBbqItem[]> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.itemsTableName ], 'readonly');
    const itemStore = transaction.objectStore(IndexedDbDataStorage.itemsTableName);

    const eventIdIndex = itemStore.index('eventId');
    const keyRange = IDBKeyRange.only(eventId);

    const cursorRequest = eventIdIndex.openCursor(keyRange);

    return new Promise<IBbqItem[]>((resolve, reject) => {
      cursorRequest.onerror = () => reject(cursorRequest.error);

      const bbqItems: IBbqItem[] = [];
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          bbqItems.push(cursor.value as IBbqItem);
          cursor.continue();
        } else {
          resolve(bbqItems);
        }
      };
    });
  }

  public async insertItem(item: IBbqItem): Promise<void> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.itemsTableName ], 'readwrite');
    const itemStore = transaction.objectStore(IndexedDbDataStorage.itemsTableName);
    const putRequest = itemStore.put(item);
    return new Promise<void>((resolve, reject) => {
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve();
    });
  }

  public async updateItem(item: IBbqItem): Promise<void> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.itemsTableName ], 'readwrite');
    const itemStore = transaction.objectStore(IndexedDbDataStorage.itemsTableName);
    const putRequest = itemStore.put(item);
    return new Promise<void>((resolve, reject) => {
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve();
    });
  }

  public async insertItemLog(itemLog: IBbqItemLog): Promise<void> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.itemLogTableName ], 'readwrite');
    const itemLogStore = transaction.objectStore(IndexedDbDataStorage.itemLogTableName);
    const putRequest = itemLogStore.put(itemLog);
    return new Promise<void>((resolve, reject) => {
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve();
    });
  }

  public async forEachItemLog(eventId: string, forEach: (log: IBbqItemLog, current: number, total: number) => void): Promise<void> {
    const transaction = this.db.transaction([ IndexedDbDataStorage.itemLogTableName ], 'readonly');
    const itemLogStore = transaction.objectStore(IndexedDbDataStorage.itemLogTableName);

    const eventIdIndex = itemLogStore.index('eventId');
    const keyRange = IDBKeyRange.only(eventId);

    const countRequest = itemLogStore.count(keyRange);
    const totalCount = await this.getResult(countRequest);

    // TODO: figure out why this doesn't work when it seems like it should
    let currentCount = 0;
    const cursorRequest = eventIdIndex.openCursor(keyRange);

    return new Promise<void>((resolve, reject) => {
      cursorRequest.onerror = () => reject(cursorRequest.error);

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          currentCount++;
          forEach(cursor.value as IBbqItemLog, currentCount, totalCount);
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  private async getResult<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  private async ensureDb(): Promise<void> {
    if (!this.db && !this.opening) {
      this.opening = true;
      this.db = await this.openDb();
    }
  }

  private openDb(): Promise<IDBDatabase> {
    const req = window.indexedDB.open(IndexedDbDataStorage.dbName, 5);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        return resolve(req.result);
      };

      req.onerror = () => {
        return reject(req.error);
      };

      req.onupgradeneeded = function (vargs) {
        const db = this.result;
        db.onerror = () => {
          return reject(req.error);
        };

        let itemLogStore: IDBObjectStore = null;

        // Initial creation
        if (!vargs.oldVersion) {
          // define events table
          const eventsStore = db.createObjectStore(IndexedDbDataStorage.eventsTableName, { keyPath: 'id' });

          // define items table
          const itemStore = db.createObjectStore(IndexedDbDataStorage.itemsTableName, { keyPath: 'id' });
          itemStore.createIndex('eventId', 'eventId', { unique: false });

          // define itemlog table
          itemLogStore = db.createObjectStore(IndexedDbDataStorage.itemLogTableName, {keyPath: 'id'});
          itemLogStore.createIndex('eventId', 'eventId', { unique: false });
          itemLogStore.createIndex('bbqItemId', 'bbqItemId', { unique: false });

          return;
        }

        // Versions prior to 5 had a bug where there was no index on itemLogStore
        if (vargs.oldVersion < 5) {
          itemLogStore = this.transaction.objectStore(IndexedDbDataStorage.itemLogTableName);
          itemLogStore.createIndex('eventId', 'eventId', { unique: false });
          itemLogStore.createIndex('bbqItemId', 'bbqItemId', { unique: false });
        }
      };
    });
  }
}
