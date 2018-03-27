using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IotBbq.App.Services;
using Windows.UI.Xaml.Data;

namespace IotBbq.App.Converters
{
    public class TemperatureConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            Temps temps = (Temps)value;
            return $"{temps.Farenheight:N2} F";
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
