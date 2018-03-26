using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.App.Mcp3008;

namespace IotBbq.App.Services.Implementation
{
    public class DesignThermometerService : IThermometerService
    {
        private Random random = new Random();

        public Task<Mcp3008Reading> ReadThermometer(int index)
        {
            // Get a random raw value 0 - 1023
            int rawValue = this.random.Next(0, 1024);

            return Task.FromResult(new Mcp3008Reading(rawValue));
        }
    }
}
