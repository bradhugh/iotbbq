using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services
{
    public interface ISmokerSettingsManager
    {
        Task<SmokerSettings> GetSmokerSettingsAsync();

        Task<SmokerSettings> EditSmokerSettingsAsync();
    }
}
