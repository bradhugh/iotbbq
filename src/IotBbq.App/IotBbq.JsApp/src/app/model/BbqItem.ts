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
  thermometerIndex: number;
  lastLogUploadTime: Date;
}

export class BbqItem implements IBbqItem {
  public id: string;
  public eventId: string;
  public name: string;
  public itemType: string;
  public currentPhase: string;
  public weight: number;
  public targetTemperature: number;
  public temperature: number;
  public cookStartTime: Date;
  public thermometerIndex: number;
  public lastLogUploadTime: Date;

  public load(other: IBbqItem) {
    this.id = other.id;
    this.name = other.name;
    this.itemType = other.itemType;
    this.currentPhase = other.currentPhase;
    this.weight = other.weight;
    this.targetTemperature = other.targetTemperature;
    this.temperature = other.temperature;
    this.cookStartTime = other.cookStartTime;
    this.thermometerIndex = other.thermometerIndex;
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
    other.thermometerIndex = this.thermometerIndex;
    other.lastLogUploadTime = this.lastLogUploadTime;
  }
}
