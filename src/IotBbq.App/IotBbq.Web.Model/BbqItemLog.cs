using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IotBbq.Web.Model
{
    public class BbqItemLog : EntityBase
    {
        [JsonProperty("eventId")]
        public Guid EventId { get; set; }

        [JsonProperty("bbqItemId")]
        public Guid BbqItemId { get; set; }

        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }

        [JsonProperty("currentPhase")]
        public string CurrentPhase { get; set; }

        [JsonProperty("itemName")]
        public string ItemName { get; set; }

        [JsonProperty("thermometer")]
        public int Thermometer { get; set; }

        [JsonProperty("temperature")]
        public float Temperature { get; set; }

        public BbqItem BbqItem { get; set; }
    }
}
