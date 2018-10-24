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

        public bool IsCookingPhase { get; set; }

        public override string ToString()
        {
            return this.PhaseName;
        }

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
                            IsCookingPhase = true,
                            NextPhases = new[]
                            {
                                new ItemPhaseDefinition
                                {
                                    PhaseName = "Wrap",
                                    IsCookingPhase = true,
                                    NextPhases = new[]
                                    {
                                        new ItemPhaseDefinition
                                        {
                                            PhaseName = "Unwrap",
                                            IsCookingPhase = true,
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
                            IsCookingPhase = true,
                            NextPhases = new[]
                            {
                                new ItemPhaseDefinition
                                {
                                    PhaseName = "Wrap",
                                    IsCookingPhase = true,
                                    NextPhases = new[]
                                    {
                                        new ItemPhaseDefinition
                                        {
                                            PhaseName = "Unwrap",
                                            IsCookingPhase = true,
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

        public static ItemPhaseDefinition FindPhase(string phaseName, ItemPhaseDefinition searchRoot)
        {
            if (searchRoot.PhaseName == phaseName)
            {
                return searchRoot;
            }

            foreach (var current in searchRoot.NextPhases)
            {
                var result = FindPhase(phaseName, current);
                if (result != null)
                {
                    return result;
                }
            }

            return null;
        }
    }
}
