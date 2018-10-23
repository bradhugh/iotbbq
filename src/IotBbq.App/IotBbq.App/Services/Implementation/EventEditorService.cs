using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.Model;
using Windows.UI.Xaml.Controls;

namespace IotBbq.App.Services.Implementation
{
    public class EventEditorService : IEventEditorService
    {
        public async Task<BbqEvent> EditEventAsync(BbqEvent input)
        {
            using (IotBbqContext context = new IotBbqContext())
            {
                bool isNew = false;
                if (input == null)
                {
                    input = new BbqEvent();
                    isNew = true;
                }

                var dialog = new Dialogs.EventEditorDialog();
                dialog.Event = input;

                var result = await dialog.ShowAsync();
                if (result == ContentDialogResult.Primary)
                {
                    input = dialog.Event;
                    if (isNew)
                    {
                        context.Events.Add(input);
                    }
                    else
                    {
                        context.Events.Update(input);
                    }

                    await context.SaveChangesAsync();

                    return input;
                }

                return null;
            }
        }
    }
}
