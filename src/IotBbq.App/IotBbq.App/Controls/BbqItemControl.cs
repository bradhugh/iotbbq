
namespace IotBbq.App.Controls
{
    using System;
    using System.Threading.Tasks;
    using System.Windows.Input;
    using CommonServiceLocator;
    using GalaSoft.MvvmLight.Command;
    using IotBbq.App.Services;
    using IotBbq.App.ViewModels;
    using IotBbq.Model;
    using Windows.UI;
    using Windows.UI.Xaml;
    using Windows.UI.Xaml.Controls;
    using Windows.UI.Xaml.Media;

    public sealed class BbqItemControl : Control
    {
        public static readonly DependencyProperty ItemProperty = DependencyProperty.Register(
            "Item",
            typeof(BbqItemViewModel),
            typeof(BbqItemControl),
            null);

        public static readonly DependencyProperty TemperatureProperty = DependencyProperty.Register(
            "Temperature",
            typeof(Temps),
            typeof(BbqItemControl),
            null);

        public static readonly DependencyProperty ThermometerIndexProperty = DependencyProperty.Register(
            "ThermometerIndex",
            typeof(int),
            typeof(BbqItemControl),
            null);

        public static readonly DependencyProperty PhaseCommandProperty = DependencyProperty.Register(
            "PhaseCommand",
            typeof(ICommand),
            typeof(BbqItemControl),
            null);

        private static readonly SolidColorBrush AlarmingBackgroundBrush = new SolidColorBrush(Colors.Red);

        private static readonly SolidColorBrush NormalBackgroundBrush = new SolidColorBrush(Colors.White);

        private readonly Lazy<IThermometerService> thermometerService = new Lazy<IThermometerService>(() => ServiceLocator.Current.GetInstance<IThermometerService>());

        private readonly Lazy<IPhaseChooser> phaseChooser = new Lazy<IPhaseChooser>(() => ServiceLocator.Current.GetInstance<IPhaseChooser>());

        private readonly Lazy<IBbqDataProvider> dataProvider = new Lazy<IBbqDataProvider>(() => ServiceLocator.Current.GetInstance<IBbqDataProvider>());

        private readonly Lazy<IAlarmService> alarmService = new Lazy<IAlarmService>(() => ServiceLocator.Current.GetInstance<IAlarmService>());

        private readonly DispatcherTimer tempRefreshTimer = new DispatcherTimer();

        private bool isAlarming;

        public BbqItemControl()
        {
            this.DefaultStyleKey = typeof(BbqItemControl);

            this.Loaded += this.OnLoaded;

            this.PhaseCommand = new RelayCommand(this.ExecutePhaseCommand);

            this.tempRefreshTimer.Interval = TimeSpan.FromSeconds(5);
            this.tempRefreshTimer.Tick += this.OnTempRefreshTimer;
        }

        private void OnTempRefreshTimer(object sender, object e)
        {
            int? thermometerIndex = this.Item?.ThermometerIndex;
            if (thermometerIndex.HasValue)
            {
                this.thermometerService.Value.ReadThermometer(thermometerIndex.Value - 1).ContinueWith(t =>
                {
                    this.Temperature = t.Result;

                    if (this.Temperature.Farenheight >= this.Item.TargetTemperature)
                    {
                        this.SetAlarmState();
                    }
                    else
                    {
                        this.ClearAlarmState();
                    }
                },
                TaskScheduler.FromCurrentSynchronizationContext());
            }

            this.Item?.RaiseCookStartTimeChanged();
        }

        private void ClearAlarmState()
        {
            this.isAlarming = false;
            this.Background = NormalBackgroundBrush;
        }

        private void SetAlarmState()
        {
            if (!this.isAlarming)
            {
                this.isAlarming = true;
                this.Background = AlarmingBackgroundBrush;

                this.alarmService.Value.TriggerAlarm(AlarmPriority.Normal);
            }
        }

        private async void ExecutePhaseCommand()
        {
            var def = this.Item.Definition;
            var phase = this.CurrentPhase;

            var nextPhase = await this.phaseChooser.Value.ChooseNextPhaseAsync(def, phase);
            if (nextPhase != null)
            {
                this.Item.CurrentPhase = nextPhase.PhaseName;

                if (nextPhase.IsCookingPhase && !this.Item.CookStartTime.HasValue)
                {
                    this.Item.CookStartTime = DateTime.Now;
                }

                // Update the Db Item
                var dbItem = await this.dataProvider.Value.GetItemByIdAsync(this.Item.Id);
                dbItem.Load(this.Item);

                await this.dataProvider.Value.UpdateItemAsync(dbItem);
            }
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            this.tempRefreshTimer.Start();
        }

        public ItemPhaseDefinition CurrentPhase
        {
            get
            {
                string currentPhaseName = this.Item?.CurrentPhase;
                if (!string.IsNullOrEmpty(currentPhaseName))
                {
                    return ItemPhaseDefinition.FindPhase(currentPhaseName, this.Item.Definition.Phases);
                }

                return null;
            }
        }

        public BbqItemViewModel Item
        {
            get => (BbqItemViewModel)this.GetValue(ItemProperty);
            set => this.SetValue(ItemProperty, value);
        }

        public Temps Temperature
        {
            get => (Temps)this.GetValue(TemperatureProperty);
            set => this.SetValue(TemperatureProperty, value);
        }

        public ICommand PhaseCommand
        {
            get => (ICommand)this.GetValue(PhaseCommandProperty);
            set => this.SetValue(PhaseCommandProperty, value);
        }
    }
}
