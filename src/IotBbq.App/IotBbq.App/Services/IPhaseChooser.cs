using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services
{
    public interface IPhaseChooser
    {
        Task<ItemPhaseDefinition> ChooseNextPhaseAsync(ItemPhaseDefinition currentPhase);
    }
}
