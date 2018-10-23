using System;
using System.Threading.Tasks;
using IotBbq.App.ViewModels;
using IotBbq.Model;
using Windows.UI.Xaml.Controls;

namespace IotBbq.App.Services.Implementation
{
    public class EventEditorService : IEventEditorService
    {
        public async Task<BbqEventViewModel> EditEventAsync(BbqEventViewModel input)
        {
            bool isNew = false;
            var model = new BbqEventViewModel();
            if (input == null)
            {
                isNew = true;
            }
            else
            {
                model.Load(input);
            }

            var dialog = new Dialogs.EventEditorDialog();
            dialog.Event = model;

            var result = await dialog.ShowAsync();
            if (result == ContentDialogResult.Primary)
            {
                model = dialog.Event;

                using (IotBbqContext context = new IotBbqContext())
                {
                    var entity = new BbqEvent();
                    entity.Load(model);

                    if (isNew)
                    {
                        context.Events.Add(entity);
                    }
                    else
                    {
                        context.Events.Update(entity);
                    }

                    await context.SaveChangesAsync();

                    return model;
                }
            }

            return null;
        }
    }
}
