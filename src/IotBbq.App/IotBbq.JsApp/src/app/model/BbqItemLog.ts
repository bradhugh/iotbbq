export interface IBbqItemLog {
  id: string;
  eventId: string;
  bbqItemId: string;
  timestamp: Date;
  currentPhase: string;
  itemName: string;
  elapsedCookTime: number;
  probeNumber: number;
  temperature: number;
}
