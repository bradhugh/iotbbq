export interface ISmokerSettings {
  highGate: number;
  lowGate: number;
}

export interface ISmokerModel {
  highGate: number;
  lowGate: number;
  temperature: number;
}

export class SmokerSettings implements ISmokerSettings {
  highGate: number;
  lowGate: number;

  load(other: ISmokerSettings) {
    this.highGate = other.highGate;
    this.lowGate = other.lowGate;
  }

  writeTo(other: ISmokerSettings) {
    other.highGate = this.highGate;
    other.lowGate = this.lowGate;
  }
}
