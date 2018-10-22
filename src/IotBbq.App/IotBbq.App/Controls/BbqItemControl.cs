
namespace IotBbq.App.Controls
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.InteropServices.WindowsRuntime;
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

        public BbqItemControl()
        {
            this.DefaultStyleKey = typeof(BbqItemControl);
        }

        public BbqItem Item
        {
            get => (BbqItem)this.GetValue(ItemProperty);
            set => this.SetValue(ItemProperty, value);
        }
    }
}
