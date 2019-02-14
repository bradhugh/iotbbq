import { IDataStorage } from '../IDataStorage';
import { IBbqEvent } from '../BbqEvent';
import { IBbqItem } from '../BbqItem';

export class InMemoryStorage implements IDataStorage {

  private events: IBbqEvent[] = [];
  private items: IBbqItem[] = [];

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
}
