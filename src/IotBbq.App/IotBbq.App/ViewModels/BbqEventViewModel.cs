using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GalaSoft.MvvmLight;
using IotBbq.Model;

namespace IotBbq.App.ViewModels
{
    public class BbqEventViewModel : ViewModelBase
    {
        private Guid id = Guid.NewGuid();

        private string eventName;

        private DateTimeOffset eventDate = new DateTimeOffset(DateTime.Today);

        public Guid Id
        {
            get => this.id;
            set => this.Set(() => this.Id, ref this.id, value);
        }

        public string EventName
        {
            get => this.eventName;
            set => this.Set(() => this.EventName, ref this.eventName, value);
        }

        public DateTimeOffset EventDate
        {
            get => this.eventDate;
            set => this.Set(() => this.EventDate, ref this.eventDate, value);
        }

        public void Load(BbqEvent bbqEvent)
        {
            this.Id = bbqEvent.Id;
            this.EventName = bbqEvent.EventName;
            this.EventDate = bbqEvent.EventDate;
        }

        public void Load(BbqEventViewModel viewModel)
        {
            this.Id = viewModel.Id;
            this.EventName = viewModel.EventName;
            this.EventDate = viewModel.EventDate;
        }
    }
}
