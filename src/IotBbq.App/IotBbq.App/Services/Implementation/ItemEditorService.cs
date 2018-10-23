using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.Model;
using Windows.UI.Xaml.Controls;
using IotBbq.App.ViewModels;

namespace IotBbq.App.Services.Implementation
{
    public class ItemEditorService : IItemEditorService
    {
        public async Task<BbqItemViewModel> EditItemAsync(int eventId, BbqItemViewModel input)
        {
            bool isNew = false;
            BbqItemViewModel model = new BbqItemViewModel();
            if (input == null)
            {
                model.BbqEventId = eventId;
                isNew = true;
            }
            else
            {
                model.Load(input);
            }

            var dialog = new Dialogs.EditItemDialog();
            dialog.Item = model;

            var result = await dialog.ShowAsync();
            if (result == ContentDialogResult.Primary)
            {
                // Save item to database
                using (var context = new IotBbqContext())
                {
                    var item = new BbqItem();
                    item.Load(model);

                    if (isNew)
                    {
                        context.Items.Add(item);
                    }
                    else
                    {
                        context.Items.Update(item);
                    }

                    await context.SaveChangesAsync();
                }

                return dialog.Item;
            }

            return null;
        }
    }
}
