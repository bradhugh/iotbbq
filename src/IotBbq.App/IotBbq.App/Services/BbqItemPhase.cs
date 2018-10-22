using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services
{
    public class BbqItemPhase
    {
        public string ItemName { get; set; }

        public string PhaseName { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }
    }
}
