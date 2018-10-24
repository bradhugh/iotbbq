using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.Model;

namespace IotBbq.App.Services
{
    public interface IBbqDataProvider
    {
        Task<IList<BbqEvent>> GetAllEventsAsync();

        Task<BbqEvent> InsertEventAsync(BbqEvent bbqEvent);

        Task<BbqEvent> UpdateEventAsync(BbqEvent bbqEvent);

        Task<BbqItem> InsertItemAsync(BbqItem bbqItem);

        Task<BbqItem> UpdateItemAsync(BbqItem bbqItem);

        Task<BbqItem> GetItemByIdAsync(Guid id);

        Task<BbqEvent> GetEventByIdAsync(Guid id);

        Task<IList<BbqItem>> GetItemsForEventAsync(Guid eventId);

        Task<BbqItemLog> InsertItemLogAsync(BbqItemLog bbqItemLog);
    }
}
