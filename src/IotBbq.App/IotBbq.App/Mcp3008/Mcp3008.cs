
namespace IotBbq.App.Mcp3008
{
    // Copyright © 2015 Daniel Porrey
    //
    // This file is part of the Windows.Devices.Sensors.Mcp3008 project.
    // 
    // Windows.Devices.Sensors.Mcp3008 is free software: you can redistribute it and/or modify
    // it under the terms of the GNU General Public License as published by
    // the Free Software Foundation, either version 3 of the License, or
    // (at your option) any later version.
    // 
    // Windows.Devices.Sensors.Mcp3008 is distributed in the hope that it will be useful,
    // but WITHOUT ANY WARRANTY; without even the implied warranty of
    // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    // GNU General Public License for more details.
    // 
    // You should have received a copy of the GNU General Public License
    // along with Windows.Devices.Sensors.Mcp3008. If not, see http://www.gnu.org/licenses/.
    //
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using Windows.Devices.Enumeration;
    using Windows.Devices.Spi;


    /// <summary>
    /// Defines an interface to the MCP3008 ADC via the SPI interface.
    /// </summary>
    public class Mcp3008 : IDisposable
    {
        /// <summary>
        /// Defines all available channels on the MCP3008.
        /// </summary>
        public static class Channels
        {
            /// <summary>
            /// A list of all available channels on the MCP3008. Single0 is the first item
            /// followed by Single1, Single 2 and so on. Differential0 is the 8th item followed by
            /// Differential1, Differential2 and so on.
            /// </summary>
            public static readonly IList<Channel> All = new List<Channel>
            (
                new Channel[] { Single0, Single1, Single2, Single3, Single4, Single5, Single6, Single7,
                                Differential0, Differential1, Differential2, Differential3, Differential4, Differential5, Differential6, Differential7 }
            );

            /// <summary>
            /// Specifies the single Channel 0 (pin 1).
            /// </summary>
            public static Channel Single0 = new Channel(InputConfiguration.SingleEnded, 0);

            /// <summary>
            /// Specifies the single Channel 1 (pin 2).
            /// </summary>
            public static Channel Single1 = new Channel(InputConfiguration.SingleEnded, 1);

            /// <summary>
            /// Specifies the single Channel 2 (pin 3).
            /// </summary>
            public static Channel Single2 = new Channel(InputConfiguration.SingleEnded, 2);

            /// <summary>
            /// Specifies the single Channel 3 (pin 4).
            /// </summary>
            public static Channel Single3 = new Channel(InputConfiguration.SingleEnded, 3);

            /// <summary>
            /// Specifies the single Channel 4 (pin 5).
            /// </summary>
            public static Channel Single4 = new Channel(InputConfiguration.SingleEnded, 4);

            /// <summary>
            /// Specifies the single Channel 5 (pin 6).
            /// </summary>
            public static Channel Single5 = new Channel(InputConfiguration.SingleEnded, 5);

            /// <summary>
            /// Specifies the single Channel6 (pin 7).
            /// </summary>
            public static Channel Single6 = new Channel(InputConfiguration.SingleEnded, 6);

            /// <summary>
            /// Specifies the single Channel 7 (pin 8).
            /// </summary>
            public static Channel Single7 = new Channel(InputConfiguration.SingleEnded, 7);

            /// <summary>
            /// Specifies the differential Channel 0 (+) and Channel 1 (-)
            /// </summary>
            public static Channel Differential0 = new Channel(InputConfiguration.Differential, 0);

            /// <summary>
            /// Specifies the differential Channel 0 (-) and Channel 1 (+)
            /// </summary>
            public static Channel Differential1 = new Channel(InputConfiguration.Differential, 1);

            /// <summary>
            /// Specifies the differential Channel 2 (+) and Channel 3 (-)
            /// </summary>
            public static Channel Differential2 = new Channel(InputConfiguration.Differential, 2);

            /// <summary>
            /// Specifies the differential Channel 2 (-) and Channel 3 (+)
            /// </summary>
            public static Channel Differential3 = new Channel(InputConfiguration.Differential, 3);

            /// <summary>
            /// Specifies the differential Channel 4 (+) and Channel 5 (-)
            /// </summary>
            public static Channel Differential4 = new Channel(InputConfiguration.Differential, 4);

            /// <summary>
            /// Specifies the differential Channel 4 (-) and Channel 5 (+)
            /// </summary>
            public static Channel Differential5 = new Channel(InputConfiguration.Differential, 5);

            /// <summary>
            /// Specifies the differential Channel 6 (+) and Channel 7 (-)
            /// </summary>
            public static Channel Differential6 = new Channel(InputConfiguration.Differential, 6);

            /// <summary>
            /// Specifies the differential Channel 6 (-) and Channel 7 (+)
            /// </summary>
            public static Channel Differential7 = new Channel(InputConfiguration.Differential, 7);
        }

        private SpiConnectionSettings settings = null;
        private SpiDevice device = null;

        /// <summary>
        /// Initializes a new instance of the Windows.Devices.Sensors.Mcp3008 with
        /// the specified Chip Select Line (0 or 1).
        /// </summary>
        /// <param name="chipSelectLine">The Chip Select Line the MCP3008
        /// is physically connected to. This value is either 0 or 1 on the
        /// Raspberry Pi 2.</param>
        public Mcp3008(int chipSelectLine)
        {
            this.Settings = new SpiConnectionSettings(chipSelectLine);

            // ***
            // *** Set the defaults for the SPI interface
            // ***			
            this.Settings.ClockFrequency = 1000000;
            this.Settings.Mode = SpiMode.Mode0;
            this.Settings.SharingMode = SpiSharingMode.Exclusive;
        }

        /// <summary>
        /// Initializes a new instance of the Windows.Devices.Sensors.Mcp3008 with
        /// the specified SpiConnectionSettings.
        /// </summary>
        /// <param name="settings">An instance of SpiConnectionSettings that specifies
        /// the parameters of the SPI connection for the MCP3008.</param>
        public Mcp3008(SpiConnectionSettings settings)
        {
            this.Settings = settings;
        }

        /// <summary>
        /// Gets the settings used on the SPI interface
        /// to communicate to the MCP3008.
        /// </summary>
        public SpiConnectionSettings Settings
        {
            get
            {
                return this.settings;
            }
            private set
            {
                this.settings = value;
            }
        }

        /// <summary>
        /// Initializes the MCP3008 by establishing a connection on the SPI interface.
        /// </summary>
        public async Task InitializeAsync()
        {
            if (this.device == null)
            {
                // ***
                // *** Select and setup SPI
                // ***
                string selector = SpiDevice.GetDeviceSelector(string.Format("SPI{0}", this.Settings.ChipSelectLine));
                var deviceInfo = await DeviceInformation.FindAllAsync(selector);
                this.device = await SpiDevice.FromIdAsync(deviceInfo[0].Id, this.Settings);
            }
            else
            {
                throw new InvalidOperationException("Already initialized");
            }
        }

        /// <summary>
        /// Gets the underlying SpiDevice instance used by this instance
        /// of Windows.Devices.Sensors.Mcp3008.
        /// </summary>
        public SpiDevice Device
        {
            get
            {
                if (this.device == null)
                {
                    throw new InvalidOperationException("Not initialized");
                }

                return this.device;
            }
            private set
            {
                this.device = value;
            }
        }

        /// <summary>
        /// Reads an integer value from the specified port. The value of the port can
        /// be a number from0 to 7.
        /// </summary>
        /// <param name="port">An integer specifying the port to read from. This is
        /// a value from 0 to 7.</param>
        /// <returns>The integer value of the specified port.</returns>
        public Mcp3008Reading Read(Channel channel)
        {
            Mcp3008Reading returnValue = new Mcp3008Reading(0);

            if (this.device != null)
            {
                // ***
                // *** Setup the read buffer
                // ***
                byte[] readBuffer = new byte[3];

                // ***
                // *** Set up the write buffer
                // ***
                byte[] writeBuffer = new byte[3] { (byte)channel.InputConfiguration, (byte)(channel.Id + 8 << 4), 0x00 };

                // ***
                // *** Send and receive the data
                // ***
                this.device.TransferFullDuplex(writeBuffer, readBuffer);

                // ***
                // *** Convert the data
                // ***
                returnValue.RawValue = ((readBuffer[1] & 3) << 8) + readBuffer[2];
            }
            else
            {
                throw new InvalidOperationException("Not initialized");
            }

            return returnValue;
        }

        /// <summary>
        /// Disposes manages objects used by this instance of Windows.Devices.Sensors.Mcp3008. After
        /// being disposed this instance should not be used.
        /// </summary>
        public void Dispose()
        {
            if (this.device != null)
            {
                this.device.Dispose();
                this.device = null;
            }
        }
    }
}
