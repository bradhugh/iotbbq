using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.Model;

namespace IotBbq.App.Services
{
    public interface IEventEditorService
    {
        Task<BbqEvent> EditEventAsync(BbqEvent input);
    }
}
