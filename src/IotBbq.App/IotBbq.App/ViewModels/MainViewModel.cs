
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

        private SmokerSettings smokerSettings;

        private BbqItemViewModel selectedItem;

        private readonly IItemEditorService itemEditor;

        private readonly IEventSelectionService eventSelectionService;

        private readonly ISmokerSettingsManager smokerSettingsManager;
        private readonly IBbqDataProvider dataProvider;

        public MainViewModel(
            IAlarmService alarmService,
            IItemEditorService itemEditor,
            IEventSelectionService eventSelectionService,
            ISmokerSettingsManager smokerSettingsManager,
            IBbqDataProvider dataProvider)
        {
            this.alarmService = alarmService;
            this.itemEditor = itemEditor;
            this.eventSelectionService = eventSelectionService;
            this.smokerSettingsManager = smokerSettingsManager;
            this.dataProvider = dataProvider;
            this.SilenceCommand = new RelayCommand(this.SilenceCommand_Execute, this.SilenceCommand_CanExecute);
            this.AddItemCommand = new RelayCommand(this.AddItemCommand_Execute);
            this.LoadDataCommand = new RelayCommand(this.LoadDataCommand_Execute);
            this.EditItemCommand = new RelayCommand(this.EditItemCommand_Execute);

            this.alarmService.AlarmStateChanged += this.OnAlarmStateChanged;

            this.TurnInTime = DateTime.Now.AddDays(1);

            if (this.IsInDesignMode)
            {
                this.SetDesignData();
            }
        }

        private void SetDesignData()
        {
            this.CurrentEvent = new BbqEventViewModel
            {
                EventDate = DateTime.Today,
                EventName = "Design event",
                TurnInTime = DateTime.Now.AddHours(1)
            };

            this.Items.Add(new BbqItemViewModel
            {
                BbqEventId = this.CurrentEvent.Id,
                Name = "Butt 1",
                TargetTemperature = 110,
                ThermometerIndex = 0,
                Weight = 1.5
            });

            this.Items.Add(new BbqItemViewModel
            {
                BbqEventId = this.CurrentEvent.Id,
                Name = "Butt 2",
                TargetTemperature = 110,
                ThermometerIndex = 1,
                Weight = 1.5
            });

            this.Items.Add(new BbqItemViewModel
            {
                BbqEventId = this.CurrentEvent.Id,
                Name = "Butt 3",
                TargetTemperature = 110,
                ThermometerIndex = 2,
                Weight = 1.5
            });

            this.Items.Add(new BbqItemViewModel
            {
                BbqEventId = this.CurrentEvent.Id,
                Name = "Butt 4",
                TargetTemperature = 110,
                ThermometerIndex = 3,
                Weight = 1.5
            });

            this.Items.Add(new BbqItemViewModel
            {
                BbqEventId = this.CurrentEvent.Id,
                Name = "Butt 5",
                TargetTemperature = 110,
                ThermometerIndex = 4,
                Weight = 1.5
            });
        }

        private async void EditItemCommand_Execute()
        {
            var selected = this.SelectedItem;
            if (selected != null)
            {
                var edited = await this.itemEditor.EditItemAsync(this.CurrentEvent.Id, selected);
                if (edited != null && selected != edited)
                {
                    selected.Load(edited);
                }
            }
        }

        private async void LoadDataCommand_Execute()
        {
            this.SmokerSettings = await this.smokerSettingsManager.GetSmokerSettingsAsync();

            // First get the event
            this.CurrentEvent = await this.eventSelectionService.SelectEventAsync();

            // Populate the Items for the event
            foreach (var item in await this.dataProvider.GetItemsForEventAsync(this.CurrentEvent.Id))
            {
                BbqItemViewModel vm = new BbqItemViewModel();
                vm.Load(item);
                this.Items.Add(vm);
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

        public SmokerSettings SmokerSettings
        {
            get => this.smokerSettings;
            set => this.Set(() => this.SmokerSettings, ref this.smokerSettings, value);
        }

        public BbqItemViewModel SelectedItem
        {
            get => this.selectedItem;
            set => this.Set(() => this.SelectedItem, ref this.selectedItem, value);
        }

        public ObservableCollection<BbqItemViewModel> Items { get; set; } = new ObservableCollection<BbqItemViewModel>();

        public ICommand SilenceCommand { get; private set; }

        public ICommand AddItemCommand { get; private set; }

        public ICommand LoadDataCommand { get; private set; }

        public ICommand EditItemCommand { get; private set; }

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
