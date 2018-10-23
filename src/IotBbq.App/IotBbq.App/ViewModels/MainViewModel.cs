
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

        private readonly IItemEditorService itemEditor;

        public MainViewModel(IAlarmService alarmService, IItemEditorService itemEditor)
        {
            this.alarmService = alarmService;
            this.itemEditor = itemEditor;
            this.SilenceCommand = new RelayCommand(this.SilenceCommand_Execute, this.SilenceCommand_CanExecute);
            this.AddItemCommand = new RelayCommand(this.AddItemCommand_Execute);

            this.alarmService.AlarmStateChanged += this.OnAlarmStateChanged;

            this.TurnInTime = DateTime.Now.AddDays(1);
        }

        private async void AddItemCommand_Execute()
        {
            var item = await this.itemEditor.EditItemAsync(null);
            if (item != null)
            {
                this.Items.Add(item);
            }
        }

        public ObservableCollection<BbqItem> Items { get; set; } = new ObservableCollection<BbqItem>();

        public ICommand SilenceCommand { get; private set; }

        public ICommand AddItemCommand { get; private set; }

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
