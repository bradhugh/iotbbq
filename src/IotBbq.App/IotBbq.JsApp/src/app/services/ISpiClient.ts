import { InjectionToken } from '@angular/core';

export interface ISpiClient {
  initialize(): Promise<void>;
  transfer(buffer: Uint8Array): Promise<Uint8Array>;
  close(): void;
}

export const SPICLIENT_TOKEN = new InjectionToken<ISpiClient>('SPICLIENT_TOKEN');
