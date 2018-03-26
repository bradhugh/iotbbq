using System.Threading.Tasks;
using IotBbq.App.Mcp3008;

namespace IotBbq.App.Services
{
    public interface IThermometerService
    {
        Task<Mcp3008Reading> ReadThermometer(int index);
    }
}