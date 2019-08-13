export interface ISpiClient {
  initialize(chipSelectLine: number): Promise<void>;
  transfer(buffer: Uint8Array): Promise<Uint8Array>;
  close(): void;
}
