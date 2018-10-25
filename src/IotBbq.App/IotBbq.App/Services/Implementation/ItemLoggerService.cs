
namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using IotBbq.Model;

    public class ItemLoggerService : IItemLoggerService
    {
        private static readonly TimeSpan LoggingInterval = TimeSpan.FromMinutes(1);

        private readonly IBbqDataProvider dataProvider;

        private readonly IThermometerService thermometerService;

        private readonly Timer logDataTimer;

        private Guid eventId;

        public ItemLoggerService(IBbqDataProvider dataProvider, IThermometerService thermometerService)
        {
            this.dataProvider = dataProvider;
            this.thermometerService = thermometerService;
            this.logDataTimer = new Timer(this.OnTimerTick);
        }

        private async void OnTimerTick(object state)
        {
            Guid currentEvent = this.eventId;
            if (currentEvent == Guid.Empty)
            {
                return;
            }

            var items = await this.dataProvider.GetItemsForEventAsync(currentEvent);
            var timestamp = DateTime.Now;

            foreach (BbqItem item in items)
            {
                var log = new BbqItemLog
                {
                    Timestamp = timestamp,
                    BbqItemId = item.Id,
                    CurrentPhase = item.CurrentPhase,
                    ItemName = item.Name,
                    Thermometer = item.ThermometerIndex
                };

                // Now get the thermometer reading
                var temps = await this.thermometerService.ReadThermometer(item.ThermometerIndex);

                // Handle the scenarios where the thermometer is reading bad values
                if (double.IsNaN(temps.Farenheight) || double.IsInfinity(temps.Farenheight))
                {
                    log.Temperature = -1;
                }
                else
                {
                    log.Temperature = temps.Farenheight;
                }

                // Now do the insert
                await this.dataProvider.InsertItemLogAsync(log);
            }
        }

        public void Start(Guid eventId)
        {
            this.eventId = eventId;

            // Start the timer now
            this.logDataTimer.Change(TimeSpan.Zero, LoggingInterval);
        }

        public void Stop()
        {
            // Stop the timer
            this.logDataTimer.Change(Timeout.Infinite, Timeout.Infinite);
        }
    }
}
