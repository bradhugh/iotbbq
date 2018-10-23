
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
    using IotBbq.Model;

    public class MainViewModel : ViewModelBase
    {
        private IAlarmService alarmService;

        private BbqEventViewModel currentEvent;

        private readonly IItemEditorService itemEditor;

        private readonly IEventSelectionService eventSelectionService;

        public MainViewModel(IAlarmService alarmService, IItemEditorService itemEditor, IEventSelectionService eventSelectionService)
        {
            this.alarmService = alarmService;
            this.itemEditor = itemEditor;
            this.eventSelectionService = eventSelectionService;
            this.SilenceCommand = new RelayCommand(this.SilenceCommand_Execute, this.SilenceCommand_CanExecute);
            this.AddItemCommand = new RelayCommand(this.AddItemCommand_Execute);
            this.LoadDataCommand = new RelayCommand(this.LoadDataCommand_Execute);

            this.alarmService.AlarmStateChanged += this.OnAlarmStateChanged;

            this.TurnInTime = DateTime.Now.AddDays(1);
        }

        private async void LoadDataCommand_Execute()
        {
            // First get the event
            this.CurrentEvent = await this.eventSelectionService.SelectEventAsync();

            // Populate the Items for the event
            using (var context = new IotBbqContext())
            {
                foreach (var item in context.Items.Where(i => i.BbqEventId == this.CurrentEvent.Id).ToList())
                {
                    BbqItemViewModel vm = new BbqItemViewModel();
                    vm.Load(item);
                    this.Items.Add(vm);
                }
            }
        }

        private async void AddItemCommand_Execute()
        {
            if (this.CurrentEvent == null)
            {
                return;
            }

            var item = await this.itemEditor.EditItemAsync(this.CurrentEvent.Id, null);
            if (item != null)
            {
                this.Items.Add(item);
            }
        }

        public BbqEventViewModel CurrentEvent
        {
            get => this.currentEvent;
            set => this.Set(() => this.CurrentEvent, ref this.currentEvent, value);
        }

        public ObservableCollection<BbqItemViewModel> Items { get; set; } = new ObservableCollection<BbqItemViewModel>();

        public ICommand SilenceCommand { get; private set; }

        public ICommand AddItemCommand { get; private set; }

        public ICommand LoadDataCommand { get; private set; }

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
