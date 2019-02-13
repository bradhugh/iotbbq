import { InjectionToken } from '@angular/core';

export interface ISpiClient {
  initialize(): Promise<void>;
  transfer(buffer: Buffer): Promise<Buffer>;
  close(): void;
}

export const SPICLIENT_TOKEN = new InjectionToken<ISpiClient>('SPICLIENT_TOKEN');
