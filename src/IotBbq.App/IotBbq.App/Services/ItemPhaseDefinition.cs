using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IotBbq.App.Services
{
    public class ItemPhaseDefinition
    {
        public string PhaseName { get; set; }

        public IList<ItemPhaseDefinition> NextPhases { get; set; }

        public static readonly ItemPhaseDefinition DonePhase = new ItemPhaseDefinition
        {
            PhaseName = "Done"
        };

        public static readonly ItemPhaseDefinition ButtsPhases = new ItemPhaseDefinition
        {
            PhaseName = "Inject",
            NextPhases = new[]
            {
                new ItemPhaseDefinition
                {
                    PhaseName = "Rub",
                    NextPhases = new[]
                    {
                        new ItemPhaseDefinition
                        {
                            PhaseName = "On Smoker",
                            NextPhases = new[]
                            {
                                new ItemPhaseDefinition
                                {
                                    PhaseName = "Wrap",
                                    NextPhases = new[]
                                    {
                                        new ItemPhaseDefinition
                                        {
                                            PhaseName = "Unwrap",
                                            NextPhases = new[]
                                            {
                                                DonePhase
                                            }
                                        },

                                        DonePhase
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        public static readonly ItemPhaseDefinition RibsPhases = new ItemPhaseDefinition
        {
            PhaseName = "Marinade",
            NextPhases = new[]
            {
                new ItemPhaseDefinition
                {
                    PhaseName = "Rub",
                    NextPhases = new[]
                    {
                        new ItemPhaseDefinition
                        {
                            PhaseName = "On Smoker",
                            NextPhases = new[]
                            {
                                new ItemPhaseDefinition
                                {
                                    PhaseName = "Wrap",
                                    NextPhases = new[]
                                    {
                                        new ItemPhaseDefinition
                                        {
                                            PhaseName = "Unwrap",
                                            NextPhases = new[]
                                            {
                                                DonePhase
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
}
