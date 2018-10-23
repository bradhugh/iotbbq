
namespace IotBbq.App.ViewModels
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Windows.Input;
    using GalaSoft.MvvmLight;
    using GalaSoft.MvvmLight.Command;
    using GalaSoft.MvvmLight.Ioc;
    using IotBbq.App.Services;

    public class MainViewModel : ViewModelBase
    {
        private IAlarmService alarmService;

        public MainViewModel(IAlarmService alarmService)
        {
            this.alarmService = alarmService;

            this.SilenceCommand = new RelayCommand(this.SilenceCommand_Execute, this.SilenceCommand_CanExecute);

            this.alarmService.AlarmStateChanged += this.OnAlarmStateChanged;

            this.TurnInTime = DateTime.Now.AddDays(1);

            var defs = ItemDefinition.GetDefinitions();

            var item1 = new BbqItem
            {
                Name = "Butts 1",
                Weight = 1.2,
                CookStartTime = DateTime.Now,
                TargetTemperature = defs[0].DefaultTargetTemperature,
                CurrentPhase = defs[0].Phases.PhaseName,
                Definition = defs[0]
            };

            var item2 = new BbqItem
            {
                Name = "Ribs 1",
                Weight = 2.1,
                CookStartTime = DateTime.Now,
                TargetTemperature = defs[1].DefaultTargetTemperature,
                CurrentPhase = defs[1].Phases.PhaseName,
                Definition = defs[1]
            };

            var item3 = new BbqItem
            {
                Name = "Ribs 1",
                Weight = 7.2,
                CookStartTime = DateTime.Now,
                TargetTemperature = defs[1].DefaultTargetTemperature,
                CurrentPhase = defs[1].Phases.PhaseName,
                Definition = defs[1]
            };

            this.Items.Add(item1);
            this.Items.Add(item2);
            this.Items.Add(item3);
        }

        public ObservableCollection<BbqItem> Items { get; set; } = new ObservableCollection<BbqItem>();

        public ICommand SilenceCommand { get; private set; }

        /// <summary>
        /// Gets or sets the turn in time
        /// </summary>
        public DateTime? TurnInTime { get; set; }

        private void OnAlarmStateChanged(object sender, bool e)
        {
            ((RelayCommand)this.SilenceCommand).RaiseCanExecuteChanged();
        }

        private bool SilenceCommand_CanExecute()
        {
            return this.alarmService.IsAlarming;
        }

        private void SilenceCommand_Execute()
        {
            this.alarmService.Silence();
        }
    }
}
