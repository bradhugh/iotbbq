
namespace IotBbq.Model
{
    using System;
    using System.Collections.Generic;
    using System.Text;

    public class BbqItem : EntityBase
    {
        public Guid BbqEventId { get; set; }

        public string Name { get; set; }

        public string ItemType { get; set; }

        public string CurrentPhase { get; set; }

        public double Weight { get; set; }

        public double TargetTemperature { get; set; }

        public DateTime? CookStartTime { get; set; }

        public int ThermometerIndex { get; set; }

        public BbqEvent BbqEvent { get; set; }
    }
}
