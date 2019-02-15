export interface IBbqEvent {
  id: string;
  name: string;
  eventDate: Date;
  turnInTime: Date;
}

export class BbqEvent implements IBbqEvent {
  id: string;
  name: string;
  eventDate: Date;
  turnInTime: Date;

  public load(other: IBbqEvent) {
    this.id = other.id;
    this.name = other.name;
    this.eventDate = other.eventDate;
    this.turnInTime = other.turnInTime;
  }

  public writeTo(other: IBbqEvent) {
    other.id = this.id;
    other.name = this.name;
    other.eventDate = this.eventDate;
    other.turnInTime = this.turnInTime;
  }
}
