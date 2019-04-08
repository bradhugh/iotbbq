export interface IBbqItem {
  id: string;
  eventId: string;
  name: string;
  itemType: string;
  currentPhase: string;
  weight: number;
  targetTemperature: number;
  temperature: number;
  cookStartTime: Date;
  probeNumber: number;
  lastLogUploadTime: Date;
}

export class BbqItem implements IBbqItem {
  public id: string = null;
  public eventId: string = null;
  public name: string = null;
  public itemType: string = null;
  public currentPhase: string = null;
  public weight = 0;
  public targetTemperature = 0;
  public temperature = 0;
  public cookStartTime: Date = null;
  public probeNumber: number = null;
  public lastLogUploadTime: Date = null;

  public load(other: IBbqItem) {
    this.id = other.id;
    this.name = other.name;
    this.itemType = other.itemType;
    this.currentPhase = other.currentPhase;
    this.weight = other.weight;
    this.targetTemperature = other.targetTemperature;
    this.temperature = other.temperature;
    this.cookStartTime = other.cookStartTime;
    this.probeNumber = other.probeNumber;
    this.lastLogUploadTime = other.lastLogUploadTime;
  }

  public writeTo(other: IBbqItem) {
    other.id = this.id;
    other.name = this.name;
    other.itemType = this.itemType;
    other.currentPhase = this.currentPhase;
    other.weight = this.weight;
    other.targetTemperature = this.targetTemperature;
    other.temperature = this.temperature;
    other.cookStartTime = this.cookStartTime;
    other.probeNumber = this.probeNumber;
    other.lastLogUploadTime = this.lastLogUploadTime;
  }
}
