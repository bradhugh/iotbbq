using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services
{
    public class ItemDefinition
    {
        private static readonly ItemDefinition ButtsDefinition = new ItemDefinition
        {
            ItemType = "Butts",
            Phases = ItemPhaseDefinition.ButtsPhases
        };

        private static readonly ItemDefinition RibsDefinition = new ItemDefinition
        {
            ItemType = "Ribs",
            Phases = ItemPhaseDefinition.RibsPhases
        };

        private static readonly ItemDefinition[] definitions = new ItemDefinition[]
        {
            ButtsDefinition,
            RibsDefinition
        };

        public string ItemType { get; set; }

        public ItemPhaseDefinition Phases { get; set; }

        public static IList<ItemDefinition> GetDefinitions()
        {
            return definitions;
        }
    }
}
