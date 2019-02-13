declare module "pi-spi" {
  function initialize(device: string): SPIClient;


  interface IMode {
    CPHA: number;
    CPOL: number;
  }

  let mode: IMode;

  interface IOrder {
    MSB_FIRST: number;
    LSB_FIRST: number;
  }

  let order: IOrder;

  class SPIClient {
    clockSpeed(speed?: number): number;
    dataMode(mode?: number): number;
    bitOrder(order?: number): number;
    transfer(buffer: Buffer, incount?: number, cb?: (error: Error, data: Buffer) => void);
    read(incount: number, cb: (error: Error, data: Buffer) => void);
    write(outbuffer: Buffer, cb: (error: Error, data: Buffer) => void);
    close(): void;
  }
}