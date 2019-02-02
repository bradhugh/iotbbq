
namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Windows.Storage;

    using IotBbq.App.Services;

    public class IotExportFolderPickerService : IExportFolderPickerService
    {
        public async Task<StorageFolder> PickFolderAsync(string eventName, DateTime timestamp)
        {
            var removableDevices = await KnownFolders.RemovableDevices.GetFoldersAsync();
            var firstDevice = removableDevices.FirstOrDefault();
            if (firstDevice == null)
            {
                return null;
            }

            var exportFolder = await firstDevice.CreateFolderAsync($"{eventName}_{timestamp:yyyy-MM-dd_HHmmss}");
            return exportFolder;
        }
    }
}
