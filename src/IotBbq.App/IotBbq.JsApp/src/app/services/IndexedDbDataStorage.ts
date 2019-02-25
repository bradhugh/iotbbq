import { IDataStorage } from './contracts/IDataStorage';
import { IBbqEvent } from '../model/BbqEvent';
import { IBbqItem } from '../model/BbqItem';
import { IBbqItemLog } from '../model/BbqItemLog';
import { ISmokerLog } from '../model/SmokerLog';
import { ISmokerSettings } from '../model/SmokerSettings';
import { Utility } from './Utility';

export class IndexedDbDataStorage implements IDataStorage {

  private static dbName = 'IotBbqDb';
  private static eventsTableName = 'bbqEvents';
  private static itemsTableName = 'bbqItems';
  private static itemLogTableName = 'bbqItemLogs';
  private static smokerLogTableName = 'smokerLog';

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

  public async forEachItemLog(
    eventId: string,
    forEach: (log: IBbqItemLog, current: number, total: number) => void,
    itemId: string = null,
    minTime: Date = Utility.MinDate,
    maxTime: Date = Utility.MaxDate,
    lowerBoundExclusive = false,
    upperBoundExclusive = false): Promise<void> {

    const transaction = this.db.transaction([ IndexedDbDataStorage.itemLogTableName ], 'readonly');
    const itemLogStore = transaction.objectStore(IndexedDbDataStorage.itemLogTableName);

    let lowerItemId = Utility.MinGuid;
    let upperItemId = Utility.MaxGuid;
    if (itemId) {
      lowerItemId = itemId;
      upperItemId = itemId;
    }

    const index = itemLogStore.index('eventIdItemIdTimestamp');

    const keyRange = IDBKeyRange.bound(
      [ eventId, lowerItemId, minTime ],
      [ eventId, upperItemId, maxTime ],
      lowerBoundExclusive,
      upperBoundExclusive);

    const countRequest = index.count(keyRange);
    const totalCount = await this.getResult(countRequest);

    let currentCount = 0;
    const cursorRequest = index.openCursor(keyRange);
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

  public async insertSmokerLog(smokerLog: ISmokerLog): Promise<void> {
    await this.ensureDb();

    const transaction = this.db.transaction([ IndexedDbDataStorage.smokerLogTableName ], 'readwrite');
    const smokerLogStore = transaction.objectStore(IndexedDbDataStorage.smokerLogTableName);
    await this.getResult(smokerLogStore.put(smokerLog));
  }

  public async forEachSmokerLog(
    eventId: string,
    forEach: (log: ISmokerLog, current: number, total: number) => void,
    minTime: Date = Utility.MinDate,
    maxTime: Date = Utility.MaxDate,
    lowerBoundExclusive = false,
    upperBoundExclusive = false): Promise<void> {

    const transaction = this.db.transaction([ IndexedDbDataStorage.smokerLogTableName ], 'readonly');
    const smokerLogStore = transaction.objectStore(IndexedDbDataStorage.smokerLogTableName);

    const eventIdIndex = smokerLogStore.index('eventIdTimestamp');

    const keyRange = IDBKeyRange.bound(
      [ eventId, minTime ],
      [ eventId, maxTime ],
      lowerBoundExclusive,
      upperBoundExclusive);

    const countRequest = eventIdIndex.count(keyRange);
    const totalCount = await this.getResult(countRequest);

    let currentCount = 0;
    const cursorRequest = eventIdIndex.openCursor(keyRange);

    return new Promise<void>((resolve, reject) => {
      cursorRequest.onerror = () => reject(cursorRequest.error);

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          currentCount++;
          forEach(cursor.value as ISmokerLog, currentCount, totalCount);
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  public async getSmokerSettings(): Promise<ISmokerSettings> {
    const settingsJson = window.localStorage.getItem('smokerSettings');
    let settings: ISmokerSettings = JSON.parse(settingsJson);
    if (!settings) {
      settings = {
        lowGate: 0,
        highGate: 0,
        setTo: 250,
      };
    } else {
      if (!settings.highGate) { settings.highGate = 0; }
      if (!settings.lowGate) { settings.lowGate = 0; }
      if (!settings.setTo) { settings.setTo = 250; }
    }

    return settings;
  }

  public async setSmokerSettings(settings: ISmokerSettings): Promise<void> {
    window.localStorage.setItem('smokerSettings', JSON.stringify(settings));
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
    const req = window.indexedDB.open(IndexedDbDataStorage.dbName, 12);

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

        let store: IDBObjectStore = null;

        // Initial creation
        if (!vargs.oldVersion) {
          // define events table
          store = db.createObjectStore(IndexedDbDataStorage.eventsTableName, { keyPath: 'id' });

          // define items table
          store = db.createObjectStore(IndexedDbDataStorage.itemsTableName, { keyPath: 'id' });
          store.createIndex('eventId', 'eventId', { unique: false });

          // define itemlog table
          store = db.createObjectStore(IndexedDbDataStorage.itemLogTableName, {keyPath: 'id' });
          store.createIndex('eventId', 'eventId', { unique: false });
          store.createIndex('bbqItemId', 'bbqItemId', { unique: false });
          store.createIndex('eventIdItemIdTimestamp', [ 'eventId', 'bbqItemId', 'timestamp' ]);

          // define smokerLog table
          store = db.createObjectStore(IndexedDbDataStorage.smokerLogTableName, { keyPath: 'id' });
          store.createIndex('eventId', 'eventId', { unique: false });
          store.createIndex('eventIdTimestamp', [ 'eventId', 'timestamp' ]);

          return;
        }

        // Versions prior to 5 had a bug where there was no index on itemLogStore
        if (vargs.oldVersion < 5) {
          store = this.transaction.objectStore(IndexedDbDataStorage.itemLogTableName);
          store.createIndex('eventId', 'eventId', { unique: false });
          store.createIndex('bbqItemId', 'bbqItemId', { unique: false });
        }

        // Version 6 introduces the smoker log
        if (vargs.oldVersion < 6) {
          store = db.createObjectStore(IndexedDbDataStorage.smokerLogTableName, { keyPath: 'id' });
          store.createIndex('eventId', 'eventId', { unique: false });
        }

        // Version 12 adds a composite index on eventid/timestamp on the smoker log
        // and a eventid/itemid/timestamp index on the item logs
        if (vargs.oldVersion < 12) {
          store = this.transaction.objectStore(IndexedDbDataStorage.itemLogTableName);
          store.createIndex('eventIdItemIdTimestamp', [ 'eventId', 'bbqItemId', 'timestamp' ]);

          store = this.transaction.objectStore(IndexedDbDataStorage.smokerLogTableName);
          store.createIndex('eventIdTimestamp', [ 'eventId', 'timestamp' ]);
        }
      };
    });
  }
}
