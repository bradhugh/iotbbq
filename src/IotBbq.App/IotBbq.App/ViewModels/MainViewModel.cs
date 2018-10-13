
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
