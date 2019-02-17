const electron = require('electron').remote;
const SPI = electron.require('pi-spi');
import { ISpiClient } from '../ISpiClient';
import { SPIClient } from 'pi-spi';

export class NodeSpiClient implements ISpiClient {

  private spi: SPIClient;

  /*
    Mode0 CPOL = 0, CPHA = 0.
    Mode1 CPOL = 0, CPHA = 1.
    Mode2 CPOL = 1, CPHA = 0.
    Mode3 CPOL = 1, CPHA = 1.
  */

  async initialize(chipSelectLine: number): Promise<void> {
    this.spi = SPI.initialize('/dev/spidev0.0');
    this.spi.clockSpeed(1000000);
    this.spi.dataMode(0); // no flags
    this.spi.bitOrder(SPI.order.MSB_FIRST);
  }

  transfer(buffer: Uint8Array): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      const nodeBuffer = Buffer.from(Array.from(buffer));
      this.spi.transfer(nodeBuffer, nodeBuffer.length, (error, data: Buffer) => {
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
