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
    public sealed partial class PhaseChooserDialog : ContentDialog
    {
        public static readonly DependencyProperty ChoicesProperty = DependencyProperty.Register(
            "Choices",
            typeof(IList<ItemPhaseDefinition>),
            typeof(PhaseChooserDialog),
            null);

        public static readonly DependencyProperty SelectedChoiceProperty = DependencyProperty.Register(
            "SelectedChoice",
            typeof(ItemPhaseDefinition),
            typeof(PhaseChooserDialog),
            null);

        public PhaseChooserDialog()
        {
            this.InitializeComponent();

            if (GalaSoft.MvvmLight.ViewModelBase.IsInDesignModeStatic)
            {
                var wrapPhase = ItemPhaseDefinition.FindPhase("Wrap", ItemPhaseDefinition.ButtsPhases);
                this.Choices = wrapPhase.NextPhases;
            }
        }

        public IList<ItemPhaseDefinition> Choices
        {
            get => (IList<ItemPhaseDefinition>)this.GetValue(ChoicesProperty);
            set => this.SetValue(ChoicesProperty, value);
        }

        public ItemPhaseDefinition SelectedChoice
        {
            get => (ItemPhaseDefinition)this.GetValue(SelectedChoiceProperty);
            set => this.SetValue(SelectedChoiceProperty, value);
        }
    }
}
