using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IotBbq.Web.Model
{
    public class ItemLoggingRequest
    {
        [JsonProperty("event")]
        public BbqEvent Event { get; set; }

        [JsonProperty("item")]
        public BbqItem Item { get; set; }

        [JsonProperty("itemLogs")]
        public List<BbqItemLog> ItemLogs { get; set; }
    }
}
