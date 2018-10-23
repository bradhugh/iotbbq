
namespace IotBbq.App.ViewModels
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using IotBbq.App.Services;
    using IotBbq.Model;

    public static class ModelExtensions
    {
        public static void Load(this BbqItem item, BbqItemViewModel viewModel)
        {
            item.Id = viewModel.Id;
            item.BbqEventId = viewModel.BbqEventId;
            item.Name = viewModel.Name;
            item.CurrentPhase = viewModel.CurrentPhase;
            item.Weight = viewModel.Weight;
            item.TargetTemperature = viewModel.TargetTemperature;
            item.CookStartTime = viewModel.CookStartTime;

            // Get the item type from the definition
            item.ItemType = viewModel.Definition.ItemType;
        }

        public static void Load(this BbqEvent bbqEvent, BbqEventViewModel viewModel)
        {
            bbqEvent.Id = viewModel.Id;
            bbqEvent.EventName = viewModel.EventName;
            bbqEvent.EventDate = viewModel.EventDate.LocalDateTime;
            bbqEvent.TurnInTime = viewModel.TurnInTime.LocalDateTime;
        }
    }
}
