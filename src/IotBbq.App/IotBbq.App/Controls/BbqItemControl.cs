
namespace IotBbq.App.Controls
{
    using System;
    using System.Threading.Tasks;
    using System.Windows.Input;
    using CommonServiceLocator;
    using GalaSoft.MvvmLight.Command;
    using IotBbq.App.Services;
    using IotBbq.App.ViewModels;
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

        private readonly Lazy<IThermometerService> thermometerService = new Lazy<IThermometerService>(() => ServiceLocator.Current.GetInstance<IThermometerService>());

        private readonly Lazy<IPhaseChooser> phaseChooser = new Lazy<IPhaseChooser>(() => ServiceLocator.Current.GetInstance<IPhaseChooser>());

        private readonly DispatcherTimer tempRefreshTimer = new DispatcherTimer();

        public BbqItemControl()
        {
            this.DefaultStyleKey = typeof(BbqItemControl);

            this.Loaded += this.OnLoaded;

            this.PhaseCommand = new RelayCommand(this.ExecutePhaseCommand);

            this.tempRefreshTimer.Interval = TimeSpan.FromSeconds(1);
            this.tempRefreshTimer.Tick += this.OnTempRefreshTimer;
        }

        private void OnTempRefreshTimer(object sender, object e)
        {
            int? thermometerIndex = this.Item?.ThermometerIndex;
            if (thermometerIndex.HasValue)
            {
                this.thermometerService.Value.ReadThermometer(thermometerIndex.Value).ContinueWith(t =>
                {
                    this.Temperature = t.Result;

                    if (this.Temperature.Farenheight >= this.Item.TargetTemperature)
                    {
                        this.Background = new SolidColorBrush(Colors.Red);
                    }
                    else
                    {
                        this.Background = new SolidColorBrush(Colors.White);
                    }
                },
                TaskScheduler.FromCurrentSynchronizationContext());
            }

            this.Item?.RaiseCookStartTimeChanged();
        }

        private async void ExecutePhaseCommand()
        {
            var def = this.Item.Definition;
            var phase = this.CurrentPhase;

            var nextPhase = await this.phaseChooser.Value.ChooseNextPhaseAsync(def, phase);
            if (nextPhase != null)
            {
                this.Item.CurrentPhase = nextPhase.PhaseName;
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
