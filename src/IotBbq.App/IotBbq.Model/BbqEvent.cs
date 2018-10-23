
namespace IotBbq.Model
{
    using System;
    using System.Collections.Generic;

    public class BbqEvent : EntityBase
    {
        public DateTime EventDate { get; set; }

        public string EventName { get; set; }

        public DateTime TurnInTime { get; set; }

        public List<BbqItem> Items { get; set; }

        public override string ToString()
        {
            return $"{this.EventDate:M/dd/yyyy} - {this.EventName}";
        }
    }
}
