using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.App.ViewModels;

namespace IotBbq.App.Services
{
    public interface IItemEditorService
    {
        Task<BbqItemViewModel> EditItemAsync(Guid eventId, BbqItemViewModel input);
    }
}
