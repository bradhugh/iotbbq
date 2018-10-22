using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services
{
    public class ItemDefinition
    {
        private static readonly ItemDefinition ButtDefinition = new ItemDefinition
        {
            ItemType = "Butt",
            DefaultTargetTemperature = 195,
            Phases = ItemPhaseDefinition.ButtsPhases
        };

        private static readonly ItemDefinition RibsDefinition = new ItemDefinition
        {
            ItemType = "Ribs",
            DefaultTargetTemperature = 180,
            Phases = ItemPhaseDefinition.RibsPhases
        };

        private static readonly ItemDefinition[] definitions = new ItemDefinition[]
        {
            ButtDefinition,
            RibsDefinition
        };

        public string ItemType { get; set; }

        public ItemPhaseDefinition Phases { get; set; }

        public double DefaultTargetTemperature { get; set; }

        public static IList<ItemDefinition> GetDefinitions()
        {
            return definitions;
        }
    }
}
