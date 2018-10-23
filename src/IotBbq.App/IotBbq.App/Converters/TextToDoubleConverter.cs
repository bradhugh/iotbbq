
namespace IotBbq.App.Converters
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Windows.UI.Xaml.Data;

    public class TextToDoubleConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value == null)
            {
                return null;
            }
            else if (value is string)
            {
                return value;
            }
            else
            {
                return value.ToString();
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            if (value is string)
            {
                string s = (string)value;
                if (double.TryParse(s, out double result))
                {
                    return result;
                }
                else
                {
                    return string.Empty;
                }
            }
            return value;
        }
    }
}
