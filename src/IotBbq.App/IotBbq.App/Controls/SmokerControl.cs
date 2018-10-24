using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using System.Windows.Input;
using CommonServiceLocator;
using GalaSoft.MvvmLight.Command;
using IotBbq.App.Services;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Documents;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;

// The Templated Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234235

namespace IotBbq.App.Controls
{
    public sealed class SmokerControl : Control
    {
        private readonly Lazy<ISmokerSettingsManager> smokerSettingsManager = new Lazy<ISmokerSettingsManager>(
            () => ServiceLocator.Current.GetInstance<ISmokerSettingsManager>());

        private readonly Lazy<IThermometerService> thermometerService = new Lazy<IThermometerService>(() => ServiceLocator.Current.GetInstance<IThermometerService>());

        private static readonly SolidColorBrush AlarmingBackgroundBrush = new SolidColorBrush(Colors.Red);

        private static readonly SolidColorBrush NormalBackgroundBrush = new SolidColorBrush(Colors.White);

        public static readonly DependencyProperty SmokerSettingsProperty = DependencyProperty.Register(
            "SmokerSettings",
            typeof(SmokerSettings),
            typeof(SmokerControl),
            null);

        public static readonly DependencyProperty TemperatureProperty = DependencyProperty.Register(
            "Temperature",
            typeof(Temps),
            typeof(SmokerControl),
            null);

        public static readonly DependencyProperty ThermometerIndexProperty = DependencyProperty.Register(
            "ThermometerIndex",
            typeof(int),
            typeof(SmokerControl),
            null);

        public static readonly DependencyProperty SmokerSettingsCommandProperty = DependencyProperty.Register(
            "SmokerSettingsCommand",
            typeof(ICommand),
            typeof(SmokerControl),
            null);

        private readonly Lazy<IAlarmService> alarmService = new Lazy<IAlarmService>(() => ServiceLocator.Current.GetInstance<IAlarmService>());

        private readonly DispatcherTimer tempRefreshTimer = new DispatcherTimer();

        private bool isAlarming;

        public SmokerControl()
        {
            this.DefaultStyleKey = typeof(SmokerControl);

            this.tempRefreshTimer.Interval = TimeSpan.FromSeconds(1);
            this.tempRefreshTimer.Tick += this.OnTempRefreshTimer;
            this.Loaded += (s, e) => this.tempRefreshTimer.Start();

            this.SmokerSettingsCommand = new RelayCommand(this.ExecuteSmokerSettingsCommand);
        }

        private async void ExecuteSmokerSettingsCommand()
        {
            var settings = await this.smokerSettingsManager.Value.EditSmokerSettingsAsync();
            if (settings != null)
            {
                this.SmokerSettings = settings;
            }
        }

        private void OnTempRefreshTimer(object sender, object e)
        {
            this.thermometerService.Value.ReadThermometer(this.ThermometerIndex).ContinueWith(t =>
            {
                this.Temperature = t.Result;

                if (this.Temperature.Farenheight >= this.SmokerSettings.HighGate
                    || this.Temperature.Farenheight < this.SmokerSettings.LowGate)
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

        public SmokerSettings SmokerSettings
        {
            get => (SmokerSettings)this.GetValue(SmokerSettingsProperty);
            set => this.SetValue(SmokerSettingsProperty, value);
        }

        public ICommand SmokerSettingsCommand
        {
            get => (ICommand)this.GetValue(SmokerSettingsCommandProperty);
            set => this.SetValue(SmokerSettingsCommandProperty, value);
        }

        public int ThermometerIndex
        {
            get => (int)this.GetValue(ThermometerIndexProperty);
            set => this.SetValue(ThermometerIndexProperty, value);
        }

        public Temps Temperature
        {
            get => (Temps)this.GetValue(TemperatureProperty);
            set => this.SetValue(TemperatureProperty, value);
        }
    }
}
