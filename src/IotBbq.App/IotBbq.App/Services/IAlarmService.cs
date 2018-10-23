
namespace IotBbq.App.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public enum AlarmPriority
    {
        Normal,
        High
    }

    public interface IAlarmService
    {
        event EventHandler<bool> AlarmStateChanged;

        bool IsAlarming { get; set; }

        void Silence();

        void TriggerAlarm(AlarmPriority priority, TimeSpan? duration = null);
    }
}
