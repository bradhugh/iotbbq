using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IotBbq.Web.Model
{
    public class SmokerLog : EntityBase
    {
        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }

        [JsonProperty("eventId")]
        public Guid EventId { get; set; }

        [JsonProperty("setTo")]
        public float SetTo { get; set; }

        [JsonProperty("temperature")]
        public float Temperature { get; set; }

        public BbqEvent Event { get; set; }
    }
}
