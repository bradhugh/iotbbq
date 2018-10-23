
namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Windows.Storage;
    using Windows.UI.Xaml.Controls;

    public class SmokerSettingsManager : ISmokerSettingsManager
    {
        public async Task<SmokerSettings> EditSmokerSettingsAsync()
        {
            var currentSettings = await this.GetSmokerSettingsAsync();

            var dialog = new Dialogs.SmokerSettingsDialog();
            dialog.Settings = currentSettings;

            var result = await dialog.ShowAsync();
            if (result == ContentDialogResult.Primary)
            {
                var localSettings = ApplicationData.Current.LocalSettings;
                localSettings.Values["Smoker.LowGate"] = dialog.Settings.LowGate;
                localSettings.Values["Smoker.HighGate"] = dialog.Settings.HighGate;
                localSettings.Values["Smoker.CurrentSetting"] = dialog.Settings.CurrentSetting;

                return currentSettings;
            }

            return null;
        }

        public Task<SmokerSettings> GetSmokerSettingsAsync()
        {
            var localSettings = ApplicationData.Current.LocalSettings;
            var smokerSettings = new SmokerSettings();

            smokerSettings.LowGate = Convert.ToDouble(localSettings.Values["Smoker.LowGate"]);
            smokerSettings.HighGate = Convert.ToDouble(localSettings.Values["Smoker.HighGate"]);
            smokerSettings.CurrentSetting = Convert.ToDouble(localSettings.Values["Smoker.CurrentSetting"]);

            return Task.FromResult(smokerSettings);
        }
    }
}
