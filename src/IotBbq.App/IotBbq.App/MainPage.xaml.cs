using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using IotBbq.App.Services;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace IotBbq.App
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private DispatcherTimer timer = new DispatcherTimer();

        private ThermometerService thermometer = new ThermometerService();

        public MainPage()
        {
            this.InitializeComponent();

            this.timer.Interval = TimeSpan.FromSeconds(1);
            this.timer.Tick += this.Timer_Tick;
            this.timer.Start();
        }

        private async void Timer_Tick(object sender, object e)
        {
            StringBuilder sbRaw = new StringBuilder();
            StringBuilder sbTemp = new StringBuilder();

            for (int i = 0; i < 2; i++)
            {
                var reading = await this.thermometer.ReadThermometer(i);
                var temp = this.GetTemps(reading.NormalizedValue);

                sbRaw.AppendFormat("{0}R {1} N{1:N3},", i, reading.RawValue, reading.NormalizedValue);
                sbTemp.AppendFormat("{0}:{1:N1}C,{2:N1}F ", i, temp.Celcius, temp.Farenheight);
            }

            this.tempTextBlock.Text = sbRaw.ToString();
            this.computedTemp.Text = sbTemp.ToString();
        }

        /// <summary>
        /// Value between 0 and 1
        /// </summary>
        /// <param name="value">The normalized value</param>
        /// <returns>The temperatures</returns>
        private Temps GetTemps(double value)
        {
            const double ThermistorRestistance = 100000;
            const double voltageMax = 3.3;

            double volts = value * voltageMax; // calculate the voltage
            Debug.WriteLine("Volts: {0}", volts);

            double ohms = ((1 / volts) * (voltageMax * ThermistorRestistance)) - ThermistorRestistance; // calculate the ohms of the thermististor
            Debug.WriteLine("Ohms: {0}", ohms);

            double lnohm = Math.Log(ohms); // take ln(ohms)

            double a, b, c;

            // A couple sites that allow you to do curves
            // http://www.thermistor.com/calculators.php
            // http://www.thinksrs.com/downloads/programs/Therm%20Calc/NTCCalibrator/NTCcalculator.htm
            
            // Coefficients
            a = 0.001495465181561;
            b = 0.000151668264064;
            c = 0.000000073468650;

            // Steinhart Hart Equation
            // T = 1/(a + b[ln(ohm)] + c[ln(ohm)]^3)

            double t1 = (b * lnohm); // b[ln(ohm)]
            double c2 = c * lnohm; // c[ln(ohm)]
            double t2 = Math.Pow(c2, 3); // c[ln(ohm)]^3

            double tempK = 1 / (a + t1 + t2); // calculate temperature

            double tempC = tempK - 273.15; // K to C
            double tempF = tempC * (9.0 / 5.0) + 32;

            return new Temps
            {
                Kelvin = tempK,
                Celcius = tempC,
                Farenheight = tempF
            };
        }

        public class Temps
        {
            public double Kelvin { get; set; }

            public double Celcius { get; set; }

            public double Farenheight { get; set; }
        }
    }
}
