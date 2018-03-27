
namespace IotBbq.App.ViewModels
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using GalaSoft.MvvmLight;
    using IotBbq.App.Services;
    using Windows.UI.Xaml;

    public class ThermometerItem : ViewModelBase
    {
        private string itemName;

        private int thermometerIndex;

        private TimeSpan timeElapsed;

        private double targetTemperature;

        private Temps currentTemperature;

        private IThermometerService thermometerService;

        private DispatcherTimer timer;

        public ThermometerItem(IThermometerService thermometerService)
        {
            this.thermometerService = thermometerService;

            this.timer = new DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(1)
            };

            this.timer.Tick += this.Timer_Tick;
            this.timer.Start();
        }

        private async void Timer_Tick(object sender, object e)
        {
            this.CurrentTemperature = await this.thermometerService.ReadThermometer(this.ThermometerIndex);
        }

        public string ItemName
        {
            get { return this.itemName; }
            set { this.Set(() => this.ItemName, ref this.itemName, value); }
        }

        public int ThermometerIndex
        {
            get { return this.thermometerIndex; }
            set { this.Set(() => this.ThermometerIndex, ref this.thermometerIndex, value); }
        }

        public double TargetTemperature
        {
            get { return this.targetTemperature; }
            set { this.Set(() => this.TargetTemperature, ref this.targetTemperature, value); }
        }

        public Temps CurrentTemperature
        {
            get { return this.currentTemperature; }
            set { this.Set(() => this.CurrentTemperature, ref this.currentTemperature, value); }
        }

        public TimeSpan TimeElapsed
        {
            get { return this.timeElapsed; }
            set { this.Set(() => this.TimeElapsed, ref this.timeElapsed, value); }
        }
    }
}
