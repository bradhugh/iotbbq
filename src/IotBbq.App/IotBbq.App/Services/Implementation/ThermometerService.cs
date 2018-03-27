
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
        private const double InputVoltage = 3.3;

        private const double BalancingResistorOhms = 100000;

        private Task initTask;

        private struct CoefficientSet
        {
            public double A;

            public double B;

            public double C;
        }

        /// <summary>
        /// Coefficients
        /// </summary>
        private static readonly CoefficientSet[] Coefficients =
        {
            // These coeificients calculated based on test results
            // 3-19-2018
            // http://www.thinksrs.com/downloads/programs/Therm%20Calc/NTCCalibrator/NTCcalculator.htm
            // R1 293466 / T1 1.66C
            // R2  96358 / T2 23C
            // R3  42082 / T3 44.44C
            new CoefficientSet
            {
                A = -1.373357407E-3,
                B = 4.914938378E-4,
                C = -5.890760444E-7,
            }
        };

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

        public async Task<Temps> ReadThermometer(int index)
        {
            if (index < 0 || index > 7)
            {
                throw new IndexOutOfRangeException("Index must be from 0-7");
            }

            await this.initTask;

            var reading = this.mcp.Read(Channels[index]);
            Debug.WriteLine($"Reading for thermometer {index} is {reading.RawValue}, Normalized: {reading.NormalizedValue}");

            double voltage = reading.RawValue * InputVoltage;
            double resistance = TempUtils.GetThermistorResistenceFromVoltage(3.3, voltage, BalancingResistorOhms);
            Debug.WriteLine($"Got Resistance {resistance} from voltage {voltage}");

            CoefficientSet coefficients = Coefficients[0];

            var temps = new Temps();
            temps.Kelvin = TempUtils.ResistanceToTemp(coefficients.A, coefficients.B, coefficients.C, resistance);
            temps.Celcius = TempUtils.KelvinToCelcius(temps.Kelvin);
            temps.Farenheight = TempUtils.CelciusToFarenheight(temps.Celcius);

            return temps;
    }
    }
}
