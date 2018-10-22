
namespace IotBbq.App.Controls
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.InteropServices.WindowsRuntime;
    using System.Threading.Tasks;
    using System.Windows.Input;
    using CommonServiceLocator;
    using GalaSoft.MvvmLight.Command;
    using IotBbq.App.Services;
    using Windows.UI.Xaml;
    using Windows.UI.Xaml.Controls;
    using Windows.UI.Xaml.Data;
    using Windows.UI.Xaml.Documents;
    using Windows.UI.Xaml.Input;
    using Windows.UI.Xaml.Media;

    public sealed class BbqItemControl : Control
    {
        public static readonly DependencyProperty ItemProperty = DependencyProperty.Register(
            "Item",
            typeof(BbqItem),
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

        private Lazy<IThermometerService> thermometerService = new Lazy<IThermometerService>(() => ServiceLocator.Current.GetInstance<IThermometerService>());

        private Lazy<IPhaseChooser> phaseChooser = new Lazy<IPhaseChooser>(() => ServiceLocator.Current.GetInstance<IPhaseChooser>());

        public BbqItemControl()
        {
            this.DefaultStyleKey = typeof(BbqItemControl);

            this.Loaded += this.OnLoaded;

            this.PhaseCommand = new RelayCommand(this.ExecutePhaseCommand);
        }

        private async void ExecutePhaseCommand()
        {
            var current = this.CurrentPhase;

            var nextPhase = await this.phaseChooser.Value.ChooseNextPhaseAsync(current);
            if (nextPhase != null)
            {
                this.Item.CurrentPhase = nextPhase.PhaseName;
            }
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            this.thermometerService.Value.ReadThermometer(this.ThermometerIndex).ContinueWith(t =>
            {
                this.Temperature = t.Result;
            },
            TaskScheduler.FromCurrentSynchronizationContext());
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

        public BbqItem Item
        {
            get => (BbqItem)this.GetValue(ItemProperty);
            set => this.SetValue(ItemProperty, value);
        }

        public Temps Temperature
        {
            get => (Temps)this.GetValue(TemperatureProperty);
            set => this.SetValue(TemperatureProperty, value);
        }

        public int ThermometerIndex
        {
            get => (int)this.GetValue(ThermometerIndexProperty);
            set => this.SetValue(ThermometerIndexProperty, value);
        }

        public ICommand PhaseCommand
        {
            get => (ICommand)this.GetValue(PhaseCommandProperty);
            set => this.SetValue(PhaseCommandProperty, value);
        }
    }
}
