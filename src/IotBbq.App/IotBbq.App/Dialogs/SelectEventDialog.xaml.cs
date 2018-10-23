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
            typeof(List<BbqEvent>),
            typeof(SelectEventDialog),
            null);

        public static readonly DependencyProperty SelectedEventProperty = DependencyProperty.Register(
            "SelectedEvent",
            typeof(BbqEvent),
            typeof(SelectEventDialog),
            null);

        public SelectEventDialog()
        {
            this.InitializeComponent();

            this.Loaded += this.OnLoaded;
        }

        public List<BbqEvent> ExistingEvents
        {
            get => (List<BbqEvent>)this.GetValue(ExistingEventsProperty);
            set => this.SetValue(ExistingEventsProperty, value);
        }

        public BbqEvent SelectedEvent
        {
            get => (BbqEvent)this.GetValue(SelectedEventProperty);
            set => this.SetValue(SelectedEventProperty, value);
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            using (var context = new IotBbqContext())
            {
                this.ExistingEvents = context.Events.ToList();
            }
        }
    }
}
