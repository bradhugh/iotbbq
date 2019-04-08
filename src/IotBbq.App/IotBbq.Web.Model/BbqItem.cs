
namespace IotBbq.Web.Model
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class BbqItem : EntityBase
    {
        [JsonProperty("eventId")]
        public Guid EventId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("itemType")]
        public string ItemType { get; set; }

        [JsonProperty("currentPhase")]
        public string CurrentPhase { get; set; }

        [JsonProperty("weight")]
        public float? Weight { get; set; }

        [JsonProperty("targetTemperature")]
        public float? TargetTemperature { get; set; }

        [JsonProperty("temperature")]
        public float? Temperature { get; set; }

        [JsonProperty("cookStartTime")]
        public DateTime? CookStartTime { get; set; }

        [JsonProperty("probeNumber")]
        public int? ProbeNumber { get; set; }

        public BbqEvent Event { get; set; }

        public List<BbqItemLog> ItemLogs { get; set; }
    }
}
