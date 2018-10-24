
namespace IotBbq.App.Services.Implementation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using IotBbq.Model;
    using Microsoft.EntityFrameworkCore.Internal;

    public class BbqDataProvider : IBbqDataProvider, IDisposable
    {
        private IotBbqContext context = new IotBbqContext();

        private AsyncLock dbLock = new AsyncLock();

        public async Task<IList<BbqEvent>> GetAllEventsAsync()
        {
            using (await this.dbLock.LockAsync())
            {
                return this.context.Events.ToList();
            }
        }

        public async Task<BbqEvent> InsertEventAsync(BbqEvent bbqEvent)
        {
            using (await this.dbLock.LockAsync())
            {
                this.context.Events.Add(bbqEvent);
                await this.context.SaveChangesAsync();

                return bbqEvent;
            }
        }

        public async Task<BbqEvent> UpdateEventAsync(BbqEvent bbqEvent)
        {
            using (await this.dbLock.LockAsync())
            {
                this.context.Events.Update(bbqEvent);
                await this.context.SaveChangesAsync();

                return bbqEvent;
            }
        }

        public void Dispose()
        {
            this.context.Dispose();
        }

        public async Task<BbqItem> InsertItemAsync(BbqItem bbqItem)
        {
            using (await this.dbLock.LockAsync())
            {
                this.context.Items.Add(bbqItem);
                await this.context.SaveChangesAsync();

                return bbqItem;
            }
        }

        public async Task<BbqItem> UpdateItemAsync(BbqItem bbqItem)
        {
            using (await this.dbLock.LockAsync())
            {
                this.context.Items.Update(bbqItem);
                await this.context.SaveChangesAsync();

                return bbqItem;
            }
        }

        public async Task<IList<BbqItem>> GetItemsForEventAsync(Guid eventId)
        {
            using (await this.dbLock.LockAsync())
            {
                return this.context.Items.Where(i => i.BbqEventId == eventId).ToList();
            }
        }
    }
}
