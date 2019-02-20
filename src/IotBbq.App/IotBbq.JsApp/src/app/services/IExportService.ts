import { InjectionToken } from '@angular/core';

export interface IExportService {
  exportData(eventId: string): Promise<void>;
}

export const EXPORT_SERVICE_TOKEN = new InjectionToken<IExportService>('EXPORT_SERVICE_TOKEN');