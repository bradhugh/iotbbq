using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using IotBbq.App.Services;
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
    public sealed partial class EditItemDialog : ContentDialog
    {
        public static readonly DependencyProperty ItemProperty = DependencyProperty.Register(
            "Item",
            typeof(BbqItemViewModel),
            typeof(EditItemDialog),
            null);

        public static readonly DependencyProperty ItemTypesProperty = DependencyProperty.Register(
            "ItemTypes",
            typeof(ItemDefinition),
            typeof(EditItemDialog),
            null);

        public static readonly DependencyProperty AvailableThermometersProperty = DependencyProperty.Register(
            "AvailableThermometers",
            typeof(IList<int>),
            typeof(EditItemDialog),
            null);

        public EditItemDialog()
        {
            this.InitializeComponent();

            this.ItemTypes = ItemDefinition.GetDefinitions();

            // Todo - be smarter about this.
            this.AvailableThermometers = new[] { 1, 2, 3, 4, 5, 6 };

            if (GalaSoft.MvvmLight.ViewModelBase.IsInDesignModeStatic)
            {
                var defs = ItemDefinition.GetDefinitions();
                this.Item = new BbqItemViewModel
                {
                    Name = "Butt 1",
                    TargetTemperature = defs[0].DefaultTargetTemperature,
                    Definition = defs[0],
                    Weight = 8.2
                };
            }

            this.Closing += OnClosing;
        }

        private void OnClosing(ContentDialog sender, ContentDialogClosingEventArgs args)
        {
            var item = this.Item;
            if (item != null && args.Result == ContentDialogResult.Primary)
            {
                var validationResult = item.Validator.ValidateAll();
                if (validationResult != null && !validationResult.IsValid)
                {
                    foreach (var error in validationResult.ErrorList)
                    {
                        string originalText = this.validationErrors.Text;

                        if (!string.IsNullOrEmpty(originalText))
                        {
                            this.validationErrors.Text += Environment.NewLine;
                        }

                        this.validationErrors.Text += error.ErrorText;
                    }

                    // Show the error and don't allow the dialog to close
                    this.validationErrors.Visibility = Visibility.Visible;
                    args.Cancel = true;
                }
            }
        }

        public IList<ItemDefinition> ItemTypes
        {
            get => (IList<ItemDefinition>)this.GetValue(ItemTypesProperty);
            set => this.SetValue(ItemTypesProperty, value);
        }

        public IList<int> AvailableThermometers
        {
            get => (IList<int>)this.GetValue(AvailableThermometersProperty);
            set => this.SetValue(AvailableThermometersProperty, value);
        }

        public BbqItemViewModel Item
        {
            get => (BbqItemViewModel)this.GetValue(ItemProperty);
            set => this.SetValue(ItemProperty, value);
        }
    }
}
