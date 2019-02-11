export interface IBbqItem {
  id: string;
  eventId: string;
  name: string;
  currentPhase: string;
  weight: number;
  targetTemperature: number;
  temperature: number;
  cookStartTime: Date;
  thermometerIndex: number;
}
