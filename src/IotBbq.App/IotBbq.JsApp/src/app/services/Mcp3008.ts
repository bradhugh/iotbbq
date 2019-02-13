// tslint:disable: no-bitwise

import { ISpiClient } from './ISpiClient';

export enum InputConfiguration {
  SingleEnded = 1,
  Differential = 0,
}

export class Channel {
    constructor(
      public inputConfiguration: InputConfiguration,
      public id: number) {}
}

export class Mcp3008Reading {
  constructor(private rawValue: number) {}

  getRawValue(): number {
    return this.rawValue;
  }

  getNormalizedValue(): number {
    return this.rawValue / 1023.0;
  }
}

export class Channels {

  public static Single0 = new Channel(InputConfiguration.SingleEnded, 0);
  public static Single1 = new Channel(InputConfiguration.SingleEnded, 1);
  public static Single2 = new Channel(InputConfiguration.SingleEnded, 2);
  public static Single3 = new Channel(InputConfiguration.SingleEnded, 3);
  public static Single4 = new Channel(InputConfiguration.SingleEnded, 4);
  public static Single5 = new Channel(InputConfiguration.SingleEnded, 5);
  public static Single6 = new Channel(InputConfiguration.SingleEnded, 6);
  public static Single7 = new Channel(InputConfiguration.SingleEnded, 7);

  public static Differential0 = new Channel(InputConfiguration.Differential, 0);
  public static Differential1 = new Channel(InputConfiguration.Differential, 1);
  public static Differential2 = new Channel(InputConfiguration.Differential, 2);
  public static Differential3 = new Channel(InputConfiguration.Differential, 3);
  public static Differential4 = new Channel(InputConfiguration.Differential, 4);
  public static Differential5 = new Channel(InputConfiguration.Differential, 5);
  public static Differential6 = new Channel(InputConfiguration.Differential, 6);
  public static Differential7 = new Channel(InputConfiguration.Differential, 7);

  public static All: Channel[] = [
    Channels.Single0, Channels.Single1, Channels.Single2, Channels.Single3,
    Channels.Single4, Channels.Single5, Channels.Single6, Channels.Single7,
    Channels.Differential0, Channels.Differential1, Channels.Differential2, Channels.Differential3,
    Channels.Differential4, Channels.Differential5, Channels.Differential6, Channels.Differential7
  ];
}

export class Mcp3008 {

  private initTask: Promise<void> = null;

  constructor(
    private spiClient: ISpiClient,
    chipSelectLine: number) {
      this.initTask = this.spiClient.initialize();
  }

  public async read(channel: Channel): Promise<Mcp3008Reading> {

    await this.initTask;

    const writeBuffer = new Uint8Array(3);
    writeBuffer[0] = channel.inputConfiguration;
    writeBuffer[1] = channel.id + 8 << 4;
    writeBuffer[2] = 0;

    const readBuffer = await this.spiClient.transfer(writeBuffer);

    return new Mcp3008Reading(((readBuffer[1] & 3) << 8) + readBuffer[2]);
  }

  public close(): void {
    this.spiClient.close();
  }
}
