using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Documents;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;

// The Templated Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234235

namespace IotBbq.App.Controls
{
    public sealed class EventInfoControl : Control
    {
        public static readonly DependencyProperty DateAndTimeProperty = DependencyProperty.Register(
            "DateAndTime",
            typeof(string),
            typeof(EventInfoControl),
            null);

        public static readonly DependencyProperty EventNameProperty = DependencyProperty.Register(
            "EventName",
            typeof(string),
            typeof(EventInfoControl),
            null);

        private DispatcherTimer timer = new DispatcherTimer();

        public EventInfoControl()
        {
            this.DefaultStyleKey = typeof(EventInfoControl);

            this.UpdateDateAndTime(this, null);

            this.timer.Interval = TimeSpan.FromSeconds(30);
            this.timer.Tick += this.UpdateDateAndTime;

            this.Loaded += this.OnLoaded;
        }

        public string DateAndTime
        {
            get => (string)this.GetValue(DateAndTimeProperty);
            set => this.SetValue(DateAndTimeProperty, value);
        }

        public string EventName
        {
            get => (string)this.GetValue(EventNameProperty);
            set => this.SetValue(EventNameProperty, value);
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            this.timer.Start();
        }

        private void UpdateDateAndTime(object sender, object e)
        {
            this.DateAndTime = $"{DateTime.Now:M/d/yyyy h:mm tt}";
        }
    }
}
