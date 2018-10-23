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
    public sealed partial class EditItemDialog : ContentDialog
    {
        public static readonly DependencyProperty ItemProperty = DependencyProperty.Register(
            "Item",
            typeof(BbqItem),
            typeof(EditItemDialog),
            null);

        public static readonly DependencyProperty ItemTypesProperty = DependencyProperty.Register(
            "ItemTypes",
            typeof(ItemDefinition),
            typeof(EditItemDialog),
            null);

        public EditItemDialog()
        {
            this.InitializeComponent();

            this.ItemTypes = ItemDefinition.GetDefinitions();

            if (GalaSoft.MvvmLight.ViewModelBase.IsInDesignModeStatic)
            {
                var defs = ItemDefinition.GetDefinitions();
                this.Item = new BbqItem
                {
                    Name = "Butt 1",
                    TargetTemperature = defs[0].DefaultTargetTemperature,
                    Definition = defs[0],
                    Weight = 8.2
                };
            }
        }

        public IList<ItemDefinition> ItemTypes
        {
            get => (IList<ItemDefinition>)this.GetValue(ItemTypesProperty);
            set => this.SetValue(ItemTypesProperty, value);
        }

        public BbqItem Item
        {
            get => (BbqItem)this.GetValue(ItemProperty);
            set => this.SetValue(ItemProperty, value);
        }
    }
}
