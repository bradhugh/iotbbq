
namespace IotBbq.App.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class BbqItem
    {
        public string Name { get; set; }

        public string CurrentPhase { get; set; }

        public ItemDefinition Definition { get; set; }
    }
}
