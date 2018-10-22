
namespace IotBbq.App.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using GalaSoft.MvvmLight;

    public class BbqItem : ViewModelBase
    {
        private string name;

        private string currentPhase;

        private double weight;

        private double targetTemperature;

        private DateTime? cookStartTime;

        public string Name
        {
            get => this.name;
            set => this.Set(() => this.Name, ref this.name, value);
        }

        public string CurrentPhase
        {
            get => this.currentPhase;
            set => this.Set(() => this.CurrentPhase, ref this.currentPhase, value);
        }

        public double Weight
        {
            get => this.weight;
            set => this.Set(() => this.Weight, ref this.weight, value);
        }

        public double TargetTemperature
        {
            get => this.targetTemperature;
            set => this.Set(() => this.TargetTemperature, ref this.targetTemperature, value);
        }

        public DateTime? CookStartTime
        {
            get => this.cookStartTime;
            set => this.Set(() => this.CookStartTime, ref this.cookStartTime, value);
        }

        public ItemDefinition Definition { get; set; }

        public void RaiseCookStartTimeChanged()
        {
            this.RaisePropertyChanged(() => this.CookStartTime);
        }
    }
}
