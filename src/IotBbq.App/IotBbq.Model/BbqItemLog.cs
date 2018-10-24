
namespace IotBbq.Model
{
    using System;
    using System.Collections.Generic;
    using System.Text;

    public class BbqItemLog : EntityBase
    {
        public DateTime Timestamp { get; set; }

        public BbqItem BbqItem { get; set; }

        public Guid BbqItemId { get; set; }

        public string ItemName { get; set; }

        public double Temperature { get; set; }

        public int Thermometer { get; set; }

        public string CurrentPhase { get; set; }
    }
}
