using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.Model;
using Windows.UI.Xaml.Controls;

namespace IotBbq.App.Services.Implementation
{
    public class EventSelectionService : IEventSelectionService
    {
        private readonly IEventEditorService eventEditor;

        public EventSelectionService(IEventEditorService eventEditor)
        {
            this.eventEditor = eventEditor;
        }

        public async Task<BbqEvent> SelectEventAsync()
        {
            var selectDialog = new Dialogs.SelectEventDialog();

            BbqEvent selectedEvent = null;

            do
            {
                var result = await selectDialog.ShowAsync();
                if (result == ContentDialogResult.Primary)
                {
                    selectedEvent = selectDialog.SelectedEvent;
                }
                else if (result == ContentDialogResult.Secondary)
                {
                    selectedEvent = await this.eventEditor.EditEventAsync(null);
                }
            }
            while (selectedEvent == null);

            return selectedEvent;
        }
    }
}
