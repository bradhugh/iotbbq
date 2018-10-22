using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Data;

namespace IotBbq.App.Converters
{
    public class ElapsedTimeConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value == null)
            {
                return "Not Started";
            }

            DateTime stamp;
            if (value is DateTime)
            {
                stamp = (DateTime)value;
            }
            else if (value is DateTime?)
            {
                stamp = ((DateTime?)value).Value;
            }
            else
            {
                return "Error";
            }

            var diff = DateTime.Now - stamp;
            return $"{(int)diff.TotalHours:D2}:{diff.Minutes:D2}:{diff.Seconds:D2}";
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
