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

            for (int i = 0; i < 1; i++)
            {
                var reading = await this.thermometer.ReadThermometer(i);
                var temp = this.GetTemps(reading.NormalizedValue);

                double volts = 3.3 * reading.NormalizedValue;
                sbRaw.AppendFormat("#{0} Raw {1} or {2:N3}V, ", i, reading.RawValue, volts);
                sbTemp.AppendFormat("{0}:{1:N1}C,{2:N1}F ", i, temp.Celcius, temp.Farenheight);
            }

            this.tempTextBlock.Text = sbRaw.ToString();
            this.computedTemp.Text = sbTemp.ToString();
        }

        private Temps GetTemps(double value)
        {
            double voltage = value * 3.3;
            double resistance = TempUtils.GetThermistorResistenceFromVoltage(3.3, voltage, 100000);
            Debug.WriteLine($"Got Resistance {resistance} from voltage {voltage}");

            double a, b, c;

            // Coefficients
            // These coeificients calculated based on test results
            // 3-19-2018
            // http://www.thinksrs.com/downloads/programs/Therm%20Calc/NTCCalibrator/NTCcalculator.htm
            // R1 293466 / T1 1.66C
            // R2  96358 / T2 23C
            // R3  42082 / T3 44.44C

            a = -1.373357407E-3;
            b = 4.914938378E-4;
            c = -5.890760444E-7;

            var temps = new Temps();
            temps.Kelvin = TempUtils.ResistanceToTemp(a, b, c, resistance);
            temps.Celcius = TempUtils.KelvinToCelcius(temps.Kelvin);
            temps.Farenheight = TempUtils.CelciusToFarenheight(temps.Celcius);

            return temps;
        }

        public class Temps
        {
            public double Kelvin { get; set; }

            public double Celcius { get; set; }

            public double Farenheight { get; set; }
        }
    }
}
