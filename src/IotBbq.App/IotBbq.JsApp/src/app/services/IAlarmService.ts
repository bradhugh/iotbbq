import { InjectionToken } from "@angular/core";

export enum AlarmPriority {
  Normal,
  High
}

export interface IAlarmService {
  alarmStateChanged: (state: boolean) => void;
  isAlarming(): boolean;
  silence(): void;
  triggerAlarm(priority: AlarmPriority, duration?: number);
}

export const ALARM_SVC_TOKEN = new InjectionToken('ALARM_SVC_TOKEN');