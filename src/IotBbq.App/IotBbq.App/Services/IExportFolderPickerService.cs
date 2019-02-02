using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace IotBbq.App.Services
{
    public interface IExportFolderPickerService
    {
        Task<StorageFolder> PickFolderAsync();
    }
}
