import { IDataStorage } from '../contracts/IDataStorage';
import { IBbqEvent } from '../../model/BbqEvent';
import { IBbqItem, BbqItem } from '../../model/BbqItem';
import { IBbqItemLog } from '../../model/BbqItemLog';

export class InMemoryStorage implements IDataStorage {

  private events: IBbqEvent[] = [];
  private items: IBbqItem[] = [];
  private itemLogs: IBbqItemLog[] = [];

  public async getEventById(eventId: string): Promise<IBbqEvent> {
    const found = this.events.find(e => e.id === eventId);
    if (found) {
      return JSON.parse(JSON.stringify(found), (k, v) => {
        if (k === 'eventDate' || k === 'turnInTime') {
          return new Date(v);
        }

        return v;
      });
    }

    return null;
  }

  public async getEvents(): Promise<IBbqEvent[]> {
    return JSON.parse(JSON.stringify(this.events), (k, v) => {
      if (k === 'eventDate' || k === 'turnInTime') {
        return new Date(v);
      }

      return v;
    });
  }

  public async insertEvent(event: IBbqEvent): Promise<void> {

    if (this.events.find(e => e.id === event.id)) {
      throw new Error(`Key ${event.id} already exists`);
    }

    const clone = JSON.parse(JSON.stringify(event));
    this.events.push(clone);
  }

  public async getItems(eventId: string): Promise<IBbqItem[]> {
    const matches = this.items.filter(e => e.eventId === eventId);
    return JSON.parse(JSON.stringify(matches));
  }

  public async insertItem(item: IBbqItem): Promise<void> {
    if (!this.events.find(e => e.id === item.eventId)) {
      throw new Error(`An existing event with ID ${item.eventId} must be added before the items.`);
    }

    const clone = JSON.parse(JSON.stringify(item));
    this.items.push(clone);
  }

  public async updateItem(item: IBbqItem): Promise<void> {
    const itemToUpdate = this.items.find(i => i.id === item.id);
    if (!itemToUpdate) {
      throw new Error(`Item to update with id ${item.id} was not found`);
    }

    const tempItem = new BbqItem();
    tempItem.load(item);
    tempItem.writeTo(itemToUpdate);
  }

  public async insertItemLog(itemLog: IBbqItemLog): Promise<void> {
    if (this.itemLogs.find(e => e.id === itemLog.id)) {
      throw new Error(`Key ${itemLog.id} already exists`);
    }

    const clone = JSON.parse(JSON.stringify(event), (k, v) => {
      if (k === 'timestamp') {
        return new Date(v);
      }

      return v;
    });

    this.itemLogs.push(clone);
  }

  public async forEachItemLog(eventId: string, forEach: (log: IBbqItemLog, current: number, total: number) => void): Promise<void> {
    for (let i = 0; i < this.itemLogs.length; i++) {
      if (this.itemLogs[i].eventId === eventId) {
        forEach(this.itemLogs[i], i + 1, this.itemLogs.length);
      }
    }
  }
}
