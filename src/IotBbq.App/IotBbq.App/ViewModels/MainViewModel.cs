
namespace IotBbq.App.ViewModels
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Windows.Input;
    using GalaSoft.MvvmLight;
    using GalaSoft.MvvmLight.Command;
    using GalaSoft.MvvmLight.Ioc;
    using IotBbq.App.Services;
    using IotBbq.Model;
    using Windows.Storage.Pickers;
    using Windows.UI;
    using Windows.UI.Popups;
    using Windows.UI.Xaml.Media;

    public class MainViewModel : ViewModelBase
    {
        private IAlarmService alarmService;

        private BbqEventViewModel currentEvent;

        private SmokerSettings smokerSettings;

        private BbqItemViewModel selectedItem;

        private Brush silenceButtonBackgroundBrush;

        private readonly IItemEditorService itemEditor;

        private readonly IEventSelectionService eventSelectionService;

        private readonly ISmokerSettingsManager smokerSettingsManager;

        private readonly IBbqDataProvider dataProvider;

        private readonly IItemLoggerService loggerService;

        private static readonly SolidColorBrush AlarmingBackgroundBrush = new SolidColorBrush(Colors.Red);

        public MainViewModel(
            IAlarmService alarmService,
            IItemEditorService itemEditor,
            IEventSelectionService eventSelectionService,
            ISmokerSettingsManager smokerSettingsManager,
            IBbqDataProvider dataProvider,
            IItemLoggerService loggerService)
        {
            this.alarmService = alarmService;
            this.itemEditor = itemEditor;
            this.eventSelectionService = eventSelectionService;
            this.smokerSettingsManager = smokerSettingsManager;
            this.dataProvider = dataProvider;
            this.loggerService = loggerService;
            this.SilenceCommand = new RelayCommand(this.SilenceCommand_Execute, this.SilenceCommand_CanExecute);
            this.AddItemCommand = new RelayCommand(this.AddItemCommand_Execute);
            this.LoadDataCommand = new RelayCommand(this.LoadDataCommand_Execute);
            this.EditItemCommand = new RelayCommand(this.EditItemCommand_Execute);
            this.ExportCommand = new RelayCommand(this.ExportCommand_Execute);

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

            // Start the item logger
            this.loggerService.Start(this.CurrentEvent.Id);

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

        public Brush SilenceButtonBackgroundBrush
        {
            get => this.silenceButtonBackgroundBrush;
            set => this.Set(() => this.SilenceButtonBackgroundBrush, ref this.silenceButtonBackgroundBrush, value);
        }

        public ObservableCollection<BbqItemViewModel> Items { get; set; } = new ObservableCollection<BbqItemViewModel>();

        public ICommand SilenceCommand { get; private set; }

        public ICommand AddItemCommand { get; private set; }

        public ICommand LoadDataCommand { get; private set; }

        public ICommand EditItemCommand { get; private set; }

        public ICommand ExportCommand { get; private set; }

        /// <summary>
        /// Gets or sets the turn in time
        /// </summary>
        public DateTime? TurnInTime { get; set; }

        private void OnAlarmStateChanged(object sender, bool e)
        {
            ((RelayCommand)this.SilenceCommand).RaiseCanExecuteChanged();
            if (this.alarmService.IsAlarming)
            {
                this.SilenceButtonBackgroundBrush = AlarmingBackgroundBrush;
            }
            else
            {
                this.SilenceButtonBackgroundBrush = null;
            }
        }

        private bool SilenceCommand_CanExecute()
        {
            return this.alarmService.IsAlarming;
        }

        private void SilenceCommand_Execute()
        {
            this.alarmService.Silence();
        }

        private async void ExportCommand_Execute()
        {
            var localEvent = this.CurrentEvent;
            if (localEvent == null)
            {
                return;
            }

            // TODO: Probably eventually move this into a service
            var picker = new FolderPicker();
            picker.CommitButtonText = "Export";
            picker.FileTypeFilter.Add("*");

            var exportFolder = await picker.PickSingleFolderAsync();

            var items = await this.dataProvider.GetItemsForEventAsync(localEvent.Id);

            // Create export file
            DateTime now = DateTime.Now;

            string fileName = $"ItemLog_{localEvent.EventName}_{now:yyyy-MM-dd_HHmmss}.csv";
            var exportFile = await exportFolder.CreateFileAsync(fileName);

            using (var fs = await exportFile.OpenStreamForWriteAsync())
            using (var writer = new StreamWriter(fs))
            {
                await writer.WriteLineAsync("ItemLogId,Timestamp,BbqItemId,ItemName,Temperature,CurrentPhase,Thermometer");

                foreach (var item in items)
                {
                    var logs = await this.dataProvider.GetLogsForItemAsync(item.Id);
                    foreach (var log in logs)
                    {
                        await writer.WriteLineAsync($"{log.Id},{log.Timestamp},{log.BbqItemId},{log.ItemName},{log.Temperature},{log.CurrentPhase},{log.Thermometer}");
                    }
                }
            }

            fileName = $"Items_{localEvent.EventName}_{now:yyyy-MM-dd_HHmmss}.csv";
            exportFile = await exportFolder.CreateFileAsync(fileName);

            using (var fs = await exportFile.OpenStreamForWriteAsync())
            using (var writer = new StreamWriter(fs))
            {
                await writer.WriteLineAsync("ItemId,BbqEventId,Name,ItemType,CurrentPhase,Weight,TargetTemperature,CookStartTime,ThermometerIndex");
                foreach (var item in items)
                {
                    await writer.WriteLineAsync($"{item.Id},{item.BbqEventId},{item.Name},{item.ItemType},{item.CurrentPhase},{item.Weight},{item.TargetTemperature},{item.CookStartTime},{item.ThermometerIndex}");
                }
            }

            fileName = $"Events_{localEvent.EventName}_{now:yyyy-MM-dd_HHmmss}.csv";
            exportFile = await exportFolder.CreateFileAsync(fileName);

            var dbEvent = await this.dataProvider.GetEventByIdAsync(localEvent.Id);

            using (var fs = await exportFile.OpenStreamForWriteAsync())
            using (var writer = new StreamWriter(fs))
            {
                await writer.WriteLineAsync("EventId,EventDate,EventName,TurnInTime");
                await writer.WriteLineAsync($"{dbEvent.Id},{dbEvent.EventDate},{dbEvent.EventName},{dbEvent.TurnInTime}");
            }

            var md = new MessageDialog("Export complete");
            await md.ShowAsync();
        }
    }
}
