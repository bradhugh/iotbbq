using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services.Implementation
{
    public class DesignThermometerService : IThermometerService
    {
        private Random random = new Random();

        public Task<Temps> ReadThermometer(int index)
        {
            // Get a random raw value 0 - 499 kelvin
            int kelvin = this.random.Next(0, 500);
            double celcius = TempUtils.KelvinToCelcius(kelvin);
            var temps = new Temps
            {
                Kelvin = kelvin,
                Celcius = celcius,
                Farenheight = TempUtils.CelciusToFarenheight(celcius),
            };

            return Task.FromResult(temps);
        }
    }
}
