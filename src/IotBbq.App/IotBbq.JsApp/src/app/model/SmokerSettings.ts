export interface ISmokerSettings {
  highGate: number;
  lowGate: number;
  setTo: number;
}

export interface ISmokerModel {
  highGate: number;
  lowGate: number;
  setTo: number;
  temperature: number;
}

export class SmokerSettings implements ISmokerSettings {
  public highGate: number;
  public lowGate: number;
  public setTo: number;

  public load(other: ISmokerSettings) {
    this.highGate = other.highGate;
    this.lowGate = other.lowGate;
    this.setTo = other.setTo;
  }

  public writeTo(other: ISmokerSettings) {
    other.highGate = this.highGate;
    other.lowGate = this.lowGate;
    other.setTo = this.setTo;
  }
}
