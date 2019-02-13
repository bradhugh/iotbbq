import { ISpiClient } from '../ISpiClient';

export class DesignSpiClient implements ISpiClient {
  async initialize(chipSelectLine: number): Promise<void> {
  }

  async transfer(buffer: Uint8Array): Promise<Uint8Array> {
    const data = new Uint8Array(3);
    data[0] = 0; // This digit doesn't matter / isn't used
    data[1] = Math.round(Math.random() * 3); // Values from 0-3
    data[2] = Math.round(Math.random() * 255); // Values from 0-255
    return data;
  }

  close(): void {
  }
}
