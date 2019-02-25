using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IotBbq.Web.Model
{
    public class BbqEvent : EntityBase
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("eventDate")]
        public DateTime EventDate { get; set; }

        [JsonProperty("turnInTime")]
        public DateTime TurnInTime { get; set; }

        public List<BbqItem> Items { get; set; }

        public List<SmokerLog> SmokerLogs { get; set; }
    }
}
