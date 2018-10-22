
namespace IotBbq.App.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using GalaSoft.MvvmLight;

    public class BbqItem : ViewModelBase
    {
        private string name;

        private string currentPhase;

        public string Name
        {
            get => this.name;
            set => this.Set(() => this.Name, ref this.name, value);
        }

        public string CurrentPhase
        {
            get => this.currentPhase;
            set => this.Set(() => this.CurrentPhase, ref this.currentPhase, value);
        }

        public ItemDefinition Definition { get; set; }
    }
}
