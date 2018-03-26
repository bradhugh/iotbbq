
namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Windows.Devices.Gpio;
    using IotBbq.App.Mcp3008;
    using Windows.Devices.Spi;
    using System.Diagnostics;

    public class ThermometerService : IThermometerService
    {
        private Task initTask;

        private Mcp3008 mcp;

        private static readonly Channel[] Channels =
        {
            Mcp3008.Channels.Single0,
            Mcp3008.Channels.Single1,
            Mcp3008.Channels.Single2,
            Mcp3008.Channels.Single3,
            Mcp3008.Channels.Single4,
            Mcp3008.Channels.Single5,
            Mcp3008.Channels.Single6,
            Mcp3008.Channels.Single7
        };

        public ThermometerService()
        {
            this.mcp = new Mcp3008(0);
            this.initTask = this.mcp.InitializeAsync();
        }

        public async Task<Mcp3008Reading> ReadThermometer(int index)
        {
            if (index < 0 || index > 7)
            {
                throw new IndexOutOfRangeException("Index must be from 0-7");
            }

            await this.initTask;

            var reading = this.mcp.Read(Channels[index]);
            Debug.WriteLine($"Reading for thermometer {index} is {reading.RawValue}, Normalized: {reading.NormalizedValue}");
            return reading;
        }
    }
}
