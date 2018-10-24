using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using CommonServiceLocator;
using IotBbq.App.Services;
using IotBbq.Model;
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
    public sealed partial class SelectEventDialog : ContentDialog
    {
        public static readonly DependencyProperty ExistingEventsProperty = DependencyProperty.Register(
            "ExistingEvents",
            typeof(IList<BbqEvent>),
            typeof(SelectEventDialog),
            null);

        public static readonly DependencyProperty SelectedEventProperty = DependencyProperty.Register(
            "SelectedEvent",
            typeof(BbqEvent),
            typeof(SelectEventDialog),
            null);

        private readonly Lazy<IBbqDataProvider> dataProvider = new Lazy<IBbqDataProvider>(
            () => ServiceLocator.Current.GetInstance<IBbqDataProvider>());

        public SelectEventDialog()
        {
            this.InitializeComponent();

            this.Loaded += this.OnLoaded;
        }

        public IList<BbqEvent> ExistingEvents
        {
            get => (IList<BbqEvent>)this.GetValue(ExistingEventsProperty);
            set => this.SetValue(ExistingEventsProperty, value);
        }

        public BbqEvent SelectedEvent
        {
            get => (BbqEvent)this.GetValue(SelectedEventProperty);
            set => this.SetValue(SelectedEventProperty, value);
        }

        private async void OnLoaded(object sender, RoutedEventArgs e)
        {
            this.ExistingEvents = await this.dataProvider.Value.GetAllEventsAsync();
        }
    }
}
