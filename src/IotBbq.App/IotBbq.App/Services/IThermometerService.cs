using System.Threading.Tasks;
using IotBbq.App.Mcp3008;

namespace IotBbq.App.Services
{
    public interface IThermometerService
    {
        Task<Temps> ReadThermometer(int index);
    }

    public class Temps
    {
        public double Kelvin { get; set; }

        public double Celcius { get; set; }

        public double Farenheight { get; set; }
    }
}