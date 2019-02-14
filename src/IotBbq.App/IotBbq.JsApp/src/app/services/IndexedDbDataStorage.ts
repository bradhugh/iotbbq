import { IDataStorage } from './IDataStorage';
import { IBbqEvent } from './BbqEvent';
import { IBbqItem } from './BbqItem';

export class IndexedDbDataStorage implements IDataStorage {

  private static dbName = 'IotBbqDb';
  private static eventsTableName = 'bbqEvents';
  private static itemsTableName = 'bbqItems';

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
    // throw new Error('Method not implemented.');
    return [];
  }

  public async insertItem(item: IBbqItem): Promise<void> {
    // throw new Error('Method not implemented.');
  }

  private async ensureDb(): Promise<void> {
    if (!this.db && !this.opening) {
      this.opening = true;
      this.db = await this.openDb();
    }
  }

  private openDb(): Promise<IDBDatabase> {
    const req = window.indexedDB.open(IndexedDbDataStorage.dbName);

    return new Promise((resolve, reject) => {
      req.onsuccess = () => {
        resolve(req.result);
      };

      req.onerror = () => {
        reject(req.error);
      };

      req.onupgradeneeded = function () {
        const db = this.result;
        db.onerror = () => {
          reject(req.error);
        };

        // define events table
        const eventsStore = db.createObjectStore(IndexedDbDataStorage.eventsTableName, { keyPath: 'id' });
        eventsStore.createIndex('name', 'name', { unique: false });
        eventsStore.createIndex('eventDate', 'eventDate', { unique: false });
        eventsStore.createIndex('turnInTime', 'turnInTime', { unique: false });

        // define items table
        const itemStore = db.createObjectStore(IndexedDbDataStorage.itemsTableName, { keyPath: 'id' });
        itemStore.createIndex('name', 'name', { unique: false });
        itemStore.createIndex('eventDate', 'eventDate', { unique: false });
        itemStore.createIndex('currentPhase', 'currentPhase', { unique: false });
        itemStore.createIndex('weight', 'weight', { unique: false });
        itemStore.createIndex('targetTemperature', 'targetTemperature', { unique: false });
        itemStore.createIndex('temperature', 'temperature', { unique: false });
        itemStore.createIndex('cookStartTime', 'cookStartTime', { unique: false });
        itemStore.createIndex('thermometerIndex', 'thermometerIndex', { unique: false });
      };
    });
  }
}
