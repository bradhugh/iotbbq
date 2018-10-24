
namespace IotBbq.App.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public interface IItemLoggerService
    {
        void Start(Guid eventId);

        void Stop();
    }
}
