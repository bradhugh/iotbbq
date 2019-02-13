import * as SPI from 'pi-spi';
import { ISpiClient } from '../ISpiClient';

export class NodeSpiClient implements ISpiClient {

  private spi: SPI.SPIClient;

  async initialize(chipSelectLine: number): Promise<void> {
    this.spi = SPI.initialize('/dev/spidev0.0');
    this.spi.clockSpeed(1000000);
    this.spi.dataMode(SPI.mode.CPHA);
    this.spi.bitOrder(SPI.order.LSB_FIRST);
  }

  transfer(buffer: Buffer): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      this.spi.transfer(buffer, buffer.length, (error, data) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(data);
        }
      });
    });
  }

  close(): void {
    this.spi.close();
  }
}
