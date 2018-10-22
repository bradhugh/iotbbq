
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

        private BbqItem item1;

        private BbqItem item2;

        private BbqItem item3;

        private BbqItem item4;

        private BbqItem item5;

        private BbqItem item6;

        public MainViewModel(IAlarmService alarmService)
        {
            this.alarmService = alarmService;

            this.SilenceCommand = new RelayCommand(this.SilenceCommand_Execute, this.SilenceCommand_CanExecute);

            this.alarmService.AlarmStateChanged += this.OnAlarmStateChanged;

            this.TurnInTime = DateTime.Now.AddDays(1);

            
            var defs = ItemDefinition.GetDefinitions();

            this.Item1 = new BbqItem
            {
                Name = "Butts 1",
                CurrentPhase = defs[0].Phases.PhaseName,
                Definition = defs[0]
            };
        }

        public BbqItem Item1
        {
            get => this.item1;
            set => this.Set(() => this.Item1, ref this.item1, value);
        }

        public BbqItem Item2
        {
            get => this.item2;
            set => this.Set(() => this.Item2, ref this.item2, value);
        }

        public BbqItem Item3
        {
            get => this.item3;
            set => this.Set(() => this.Item3, ref this.item3, value);
        }

        public BbqItem Item4
        {
            get => this.item4;
            set => this.Set(() => this.Item4, ref this.item4, value);
        }

        public BbqItem Item5
        {
            get => this.item5;
            set => this.Set(() => this.Item5, ref this.item5, value);
        }

        public BbqItem Item6
        {
            get => this.item6;
            set => this.Set(() => this.Item6, ref this.item6, value);
        }

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
