using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.App.ViewModels;
using IotBbq.Model;

namespace IotBbq.App.Services
{
    public interface IEventEditorService
    {
        Task<BbqEventViewModel> EditEventAsync(BbqEventViewModel input);
    }
}
