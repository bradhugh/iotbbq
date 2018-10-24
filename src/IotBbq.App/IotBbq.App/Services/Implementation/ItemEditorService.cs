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
        private readonly IBbqDataProvider dataProvider;

        public ItemEditorService(IBbqDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        public async Task<BbqItemViewModel> EditItemAsync(Guid eventId, BbqItemViewModel input)
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
                var item = isNew ? new BbqItem() : await this.dataProvider.GetItemByIdAsync(model.Id);
                item.Load(model);

                if (isNew)
                {
                    await this.dataProvider.InsertItemAsync(item);
                }
                else
                {
                    await this.dataProvider.UpdateItemAsync(item);
                }

                return dialog.Item;
            }

            return null;
        }
    }
}
