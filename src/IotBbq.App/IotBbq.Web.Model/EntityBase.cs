
namespace IotBbq.Web.Model
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class EntityBase
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }
    }
}
