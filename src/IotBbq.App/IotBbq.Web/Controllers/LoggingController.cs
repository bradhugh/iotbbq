using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IotBbq.Web.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace IotBbq.Web.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LoggingController : ControllerBase
    {
        private LoggingContext context;

        public LoggingController(LoggingContext context)
        {
            this.context = context;
        }

        // POST api/logging/logitems
        [HttpPost]
        public async Task LogItems([FromBody] ItemLoggingRequest request)
        {
            BbqEvent bbqEvent = this.context.Events.Find(request.Event.Id);
            if (bbqEvent == null)
            {
                this.context.Events.Add(request.Event);
            }

            BbqItem bbqItem = this.context.Items.Find(request.Item.Id);
            if (bbqItem == null)
            {
                this.context.Items.Add(request.Item);
            }

            foreach (BbqItemLog log in request.ItemLogs)
            {
                var existing = this.context.ItemLogs.Find(log.Id);
                if (existing == null)
                {
                    this.context.ItemLogs.Add(log);
                }
            }

            await this.context.SaveChangesAsync();
        }

        // POST api/logging/logsmoker
        [HttpPost]
        public async Task LogSmoker([FromBody] SmokerLoggingRequest request)
        {
            BbqEvent bbqEvent = this.context.Events.Find(request.Event.Id);
            if (bbqEvent == null)
            {
                this.context.Events.Add(request.Event);
            }

            foreach (SmokerLog log in request.SmokerLogs)
            {
                var existing = this.context.SmokerLog.Find(log.Id);
                if (existing == null)
                {
                    this.context.SmokerLog.Add(log);
                }
            }

            await this.context.SaveChangesAsync();
        }
    }
}
