
namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Windows.Foundation.Diagnostics;

    public class LoggingService : ILoggingService
    {
        private const string TraceEventName = "TraceEvent";

        private static readonly Guid LoggingGuid = new Guid("277b9862-66a9-4dfe-b970-322c303360c9");

        private LoggingChannel channel = new LoggingChannel("IotBbqLogging", new LoggingChannelOptions(), LoggingGuid);

        public void Verbose(string message)
        {
            var fields = new LoggingFields();
            fields.AddString("Message", message);
            this.channel.LogEvent(TraceEventName, fields, LoggingLevel.Verbose);
        }
    }
}
