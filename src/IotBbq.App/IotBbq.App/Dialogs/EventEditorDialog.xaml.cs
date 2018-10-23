using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using IotBbq.App.ViewModels;
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
    public sealed partial class EventEditorDialog : ContentDialog
    {
        public static readonly DependencyProperty EventProperty = DependencyProperty.Register(
            "Event",
            typeof(BbqEventViewModel),
            typeof(EventEditorDialog),
            null);

        public EventEditorDialog()
        {
            this.InitializeComponent();
        }

        public BbqEventViewModel Event
        {
            get => (BbqEventViewModel)this.GetValue(EventProperty);
            set => this.SetValue(EventProperty, value);
        }
    }
}
