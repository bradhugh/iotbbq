
namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Windows.Storage;
    using Windows.Storage.Pickers;


    public class FolderPickerService : IExportFolderPickerService
    {
        public async Task<StorageFolder> PickFolderAsync()
        {
            var picker = new FolderPicker();
            picker.CommitButtonText = "Export";
            picker.FileTypeFilter.Add("*");

            var exportFolder = await picker.PickSingleFolderAsync();

            return exportFolder;
        }
    }
}
