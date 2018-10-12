using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Windows.Devices.Gpio;

namespace IotBbq.App.Services.Implementation
{
    public class AlarmService : IAlarmService
    {
        public bool IsAlarming { get; set; }

        public event EventHandler<bool> AlarmStateChanged;

        public Timer alarmTimer;

        private GpioController gpio;

        private GpioPin pinToBuzz;

        private DateTime? whenToStop;

        private ManualResetEvent neverSignaledEvent = new ManualResetEvent(false);

        private static TimeSpan Interval = TimeSpan.FromMilliseconds(300);

        public AlarmService()
        {
            this.alarmTimer = new Timer(this.OnAlarmTimerTick, null, Timeout.Infinite, Timeout.Infinite);
            this.gpio = GpioController.GetDefault();

            this.pinToBuzz = this.gpio.OpenPin(16, GpioSharingMode.Exclusive);
            this.pinToBuzz.SetDriveMode(GpioPinDriveMode.Output);
        }

        private void OnAlarmTimerTick(object state)
        {
            if (this.whenToStop.HasValue && DateTime.UtcNow >= this.whenToStop)
            {
                this.Silence();
                return;
            }

            this.DoOneBeep(new TimeSpan(Interval.Ticks / 2));
        }

        public void Silence()
        {
            if (this.IsAlarming)
            {
                // Turn off the alarm timer
                this.alarmTimer.Change(Timeout.Infinite, Timeout.Infinite);

                this.IsAlarming = false;
                this.AlarmStateChanged?.Invoke(this, false);
            }
        }

        public void TriggerAlarm(TimeSpan? duration = null)
        {
            if (!this.IsAlarming)
            {
                if (duration.HasValue)
                {
                    this.whenToStop = DateTime.UtcNow + duration.Value;
                }
                else
                {
                    this.whenToStop = null;
                }

                // Trigger the timer immediately at 1 second intervals
                this.alarmTimer.Change(TimeSpan.Zero, Interval);
                this.IsAlarming = true;
                this.AlarmStateChanged?.Invoke(this, true);
            }
        }

        private void DoOneBeep(TimeSpan singleBeepDuration)
        {
            this.pinToBuzz.Write(GpioPinValue.High);
            this.neverSignaledEvent.WaitOne(singleBeepDuration);
            this.pinToBuzz.Write(GpioPinValue.Low);
        }
    }
}
