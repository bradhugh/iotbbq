import { ISpiClient } from '../ISpiClient';

export class DesignSpiClient implements ISpiClient {
  async initialize(chipSelectLine: number): Promise<void> {
  }

  async transfer(buffer: Uint8Array): Promise<Uint8Array> {
    return new Uint8Array(3);
  }

  close(): void {
  }
}
