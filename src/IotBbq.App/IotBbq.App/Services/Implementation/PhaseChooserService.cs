namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Windows.UI.Xaml.Controls;

    public class PhaseChooserService : IPhaseChooser
    {
        public async Task<ItemPhaseDefinition> ChooseNextPhaseAsync(ItemPhaseDefinition currentPhase)
        {
            if (!currentPhase.NextPhases.Any())
            {
                throw new InvalidOperationException("Phase has no next phases!");
            }

            if (currentPhase.NextPhases.Count == 1)
            {
                return currentPhase.NextPhases.First();
            }

            // Show dialog for more than one next phase
            var dialog = new Dialogs.PhaseChooserDialog();
            dialog.Choices = currentPhase.NextPhases;

            var result = await dialog.ShowAsync();
            if (result == ContentDialogResult.Primary)
            {
                return dialog.SelectedChoice;
            }

            return null;
        }
    }
}
