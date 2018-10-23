
namespace IotBbq.Model
{
    using System;
    using System.Collections.Generic;

    public class BbqEvent
    {
        public int Id { get; set; }

        public DateTime EventDate { get; set; }

        public string EventName { get; set; }

        public List<BbqItem> Items { get; set; }
    }
}
