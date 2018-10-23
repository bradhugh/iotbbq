using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services
{
    public interface IItemEditorService
    {
        Task<BbqItem> EditItemAsync(BbqItem input);
    }
}
