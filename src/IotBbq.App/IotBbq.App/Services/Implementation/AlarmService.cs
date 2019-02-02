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

        private static TimeSpan NormalPriorityInterval = TimeSpan.FromMilliseconds(300);

        private static TimeSpan HighPriorityInterval = TimeSpan.FromMilliseconds(150);

        private AlarmPriority currentPriority;

        public AlarmService()
        {
            this.alarmTimer = new Timer(this.OnAlarmTimerTick, null, Timeout.Infinite, Timeout.Infinite);
            this.gpio = GpioController.GetDefault();

            this.pinToBuzz = this.gpio.OpenPin(16, GpioSharingMode.Exclusive);
            this.pinToBuzz.SetDriveMode(GpioPinDriveMode.Output);

            // Make sure we start low
            this.pinToBuzz.Write(GpioPinValue.Low);
        }

        private void OnAlarmTimerTick(object state)
        {
            if (this.whenToStop.HasValue && DateTime.UtcNow >= this.whenToStop)
            {
                this.Silence();
                return;
            }

            this.DoOneBeep(new TimeSpan(NormalPriorityInterval.Ticks / 2));
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

        public void TriggerAlarm(AlarmPriority priority, TimeSpan? duration = null)
        {
            if (!this.IsAlarming || (priority == AlarmPriority.High && this.currentPriority == AlarmPriority.Normal))
            {
                if (duration.HasValue)
                {
                    this.whenToStop = DateTime.UtcNow + duration.Value;
                }
                else
                {
                    this.whenToStop = null;
                }

                // Trigger the timer immediately
                this.currentPriority = priority;
                this.alarmTimer.Change(
                    TimeSpan.Zero,
                    priority == AlarmPriority.High ? HighPriorityInterval : NormalPriorityInterval);

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
