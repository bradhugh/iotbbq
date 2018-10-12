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

        public EventInfoControl()
        {
            this.DefaultStyleKey = typeof(EventInfoControl);
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
    }
}
