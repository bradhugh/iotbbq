using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Controls;

namespace IotBbq.App.Services.Implementation
{
    public class ItemEditorService : IItemEditorService
    {
        public async Task<BbqItem> EditItemAsync(BbqItem input)
        {
            if (input == null)
            {
                input = new BbqItem();
            }

            // TODO: need to implement clone here as it will always edit the item now
            var dialog = new Dialogs.EditItemDialog();
            dialog.Item = input;

            var result = await dialog.ShowAsync();
            if (result == ContentDialogResult.Primary)
            {
                return dialog.Item;
            }

            return null;
        }
    }
}
