using TegudData.Parameters;

namespace TegudData.Interfaces.Parameters
{
    public interface IStuffParameterFactory
    {
        StuffParameters BuildParameters(string categoryOrView, string categories, string name);
    }
}