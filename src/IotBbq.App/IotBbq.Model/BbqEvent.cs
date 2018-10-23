using System;
using System.Collections.Generic;
using System.Text;

namespace IotBbq.Model
{
    public class BbqEvent
    {
        public int BbqEventId { get; set; }

        public DateTime EventDate { get; set; }

        public string EventName { get; set; }

        public List<BbqModelItem> Items { get; set; }
    }
}
