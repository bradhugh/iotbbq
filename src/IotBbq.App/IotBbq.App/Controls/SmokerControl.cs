using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using CommonServiceLocator;
using IotBbq.App.Services;
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

        public static readonly DependencyProperty SmokerSettingsProperty = DependencyProperty.Register(
            "SmokerSettings",
            typeof(SmokerSettings),
            typeof(SmokerControl),
            null);

        public SmokerControl()
        {
            this.DefaultStyleKey = typeof(SmokerControl);

            this.DoubleTapped += this.OnEditSmokerSettingsRequested;
        }

        private async void OnEditSmokerSettingsRequested(object sender, DoubleTappedRoutedEventArgs e)
        {
            var settings = await this.smokerSettingsManager.Value.EditSmokerSettingsAsync();
            if (settings != null)
            {
                this.SmokerSettings = settings;
            }
        }

        public SmokerSettings SmokerSettings
        {
            get => (SmokerSettings)this.GetValue(SmokerSettingsProperty);
            set => this.SetValue(SmokerSettingsProperty, value);
        }
    }
}
