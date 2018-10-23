using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services.Implementation
{
    public class DesignAlarmService : IAlarmService
    {
        public bool IsAlarming { get; set; }

        public event EventHandler<bool> AlarmStateChanged;

        public void Silence()
        {
            if (this.IsAlarming)
            {
                this.IsAlarming = false;
                this.AlarmStateChanged?.Invoke(this, this.IsAlarming);
            }
        }

        public void TriggerAlarm(AlarmPriority priority, TimeSpan? duration = null)
        {
            if (!this.IsAlarming)
            {
                this.IsAlarming = true;
                this.AlarmStateChanged?.Invoke(this, this.IsAlarming);
            }
        }
    }
}
