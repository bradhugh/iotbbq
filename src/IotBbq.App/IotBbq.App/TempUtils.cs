using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App
{
    public static class TempUtils
    {
        public static double GetThermistorResistenceFromVoltage(double vin, double vout, double resistorOhms)
        {
            // vout = ThermistorOhms / ((resistorOhms + ThermistorOhms) * vin)
            double thermistorOhms = ((vin - vout) / vout) * resistorOhms;
            return thermistorOhms;
        }

        // Steinhart-Hart
        public static double ResistanceToTemp(double a, double b, double c, double resistance)
        {
            double temp = Math.Log(resistance);  // Saving the Log(resistance) so not to calculate it 4 times later.
            temp = 1 / (a + (b * temp) + (c * temp * temp * temp));

            return temp;
        }

        public static double KelvinToCelcius(double kelvin)
        {
            return kelvin - 273.15;  // Convert Kelvin to Celsius  
        }

        public static double CelciusToFarenheight(double celcius)
        {
            return (celcius * 9.0) / 5.0 + 32.0;
        }
    }
}
