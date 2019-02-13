/// <reference types="@types/winrt-uwp" />

import { ISpiClient } from '../ISpiClient';

export class UwpSpiClient implements ISpiClient {

  private device: Windows.Devices.Spi.SpiDevice = null;

  async initialize(chipSelectLine: number): Promise<void> {
    const settings = new Windows.Devices.Spi.SpiConnectionSettings(chipSelectLine);
    settings.clockFrequency = 1000000;
    settings.mode = Windows.Devices.Spi.SpiMode.mode0;
    settings.sharingMode = Windows.Devices.Spi.SpiSharingMode.exclusive;

    const selector: string = Windows.Devices.Spi.SpiDevice.getDeviceSelector(`SPI${settings.chipSelectLine}`);
    const deviceInfo = await Windows.Devices.Enumeration.DeviceInformation.findAllAsync(selector);
    this.device = await Windows.Devices.Spi.SpiDevice.fromIdAsync(deviceInfo[0].id, settings);
  }

  async transfer(buffer: Uint8Array): Promise<Uint8Array> {
    const writeBuffer: number[] = Array.from(buffer);
    const readBuffer = this.device.transferFullDuplex(writeBuffer);
    return new Uint8Array(readBuffer);
  }

  close(): void {
    this.device.close();
  }
}
