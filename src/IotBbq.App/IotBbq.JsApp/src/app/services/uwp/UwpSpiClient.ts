/// <reference types="@types/winrt-uwp" />

import { ISpiClient } from '../ISpiClient';

export class UwpSpiClient implements ISpiClient {

  private device: Windows.Devices.Spi.SpiDevice = null;

  async initialize(): Promise<void> {
    const settings = new Windows.Devices.Spi.SpiConnectionSettings(0);
    settings.clockFrequency = 1000000;
    settings.mode = Windows.Devices.Spi.SpiMode.mode0;
    settings.sharingMode = Windows.Devices.Spi.SpiSharingMode.exclusive;

    const selector: string = Windows.Devices.Spi.SpiDevice.getDeviceSelector(`SPI${settings.chipSelectLine}`);
    const deviceInfo = await Windows.Devices.Enumeration.DeviceInformation.findAllAsync(selector);
    this.device = await Windows.Devices.Spi.SpiDevice.fromIdAsync(deviceInfo[0].id, settings);
  }

  transfer(buffer: Buffer): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }

  close(): void {
    throw new Error('Method not implemented.');
  }
}
