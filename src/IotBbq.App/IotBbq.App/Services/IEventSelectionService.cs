using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.Model;

namespace IotBbq.App.Services
{
    public interface IEventSelectionService
    {
        Task<BbqEvent> SelectEventAsync();
    }
}
