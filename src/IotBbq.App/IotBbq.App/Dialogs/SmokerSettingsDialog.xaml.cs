using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using IotBbq.App.Services;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Content Dialog item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace IotBbq.App.Dialogs
{
    public sealed partial class SmokerSettingsDialog : ContentDialog
    {
        public static readonly DependencyProperty SettingsProperty = DependencyProperty.Register(
            "SmokerSettings",
            typeof(SmokerSettings),
            typeof(SmokerSettingsDialog),
            null);

        public SmokerSettingsDialog()
        {
            this.InitializeComponent();
        }

        public SmokerSettings Settings
        {
            get => (SmokerSettings)this.GetValue(SettingsProperty);
            set => this.SetValue(SettingsProperty, value);
        }
    }
}
