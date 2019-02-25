using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IotBbq.Web.Model
{
    public class SmokerLoggingRequest
    {
        [JsonProperty("event")]
        public BbqEvent Event { get; set; }

        [JsonProperty("smokerLogs")]
        public List<SmokerLog> SmokerLogs { get; set; }
    }
}
